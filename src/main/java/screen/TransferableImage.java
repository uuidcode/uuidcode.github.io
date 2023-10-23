package screen;

import java.awt.datatransfer.DataFlavor;
import java.awt.datatransfer.Transferable;
import java.awt.datatransfer.UnsupportedFlavorException;
import java.awt.image.BufferedImage;
import java.awt.image.RenderedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Iterator;

import javax.imageio.ImageIO;
import javax.imageio.ImageTypeSpecifier;
import javax.imageio.ImageWriter;
import javax.imageio.spi.ImageWriterSpi;
import javax.imageio.stream.ImageOutputStream;

public class TransferableImage implements Transferable {
    public static final String CONTENT_TYPE = "image/png";
    private BufferedImage bufferedImage;

    public TransferableImage(BufferedImage bufferedImage) {
        this.bufferedImage = bufferedImage;
    }

    protected byte[] imageToStandardBytesImpl(RenderedImage renderedImage,
                                              String mimeType)
        throws IOException {
        Iterator<ImageWriter> imageWriterIterator =
            ImageIO.getImageWritersByMIMEType(mimeType);

        ImageTypeSpecifier typeSpecifier =
            new ImageTypeSpecifier(renderedImage);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        IOException ioe = null;

        while (imageWriterIterator.hasNext()) {
            ImageWriter imageWriter = imageWriterIterator.next();
            ImageWriterSpi writerSpi = imageWriter.getOriginatingProvider();

            if (!writerSpi.canEncodeImage(typeSpecifier)) {
                continue;
            }

            try {
                try (ImageOutputStream imageOutputStream =
                         ImageIO.createImageOutputStream(baos)) {
                    imageWriter.setOutput(imageOutputStream);
                    imageWriter.write(renderedImage);
                    imageOutputStream.flush();
                }
            } catch (IOException e) {
                imageWriter.dispose();
                baos.reset();
                ioe = e;
                continue;
            }

            imageWriter.dispose();
            baos.close();
            return baos.toByteArray();
        }

        baos.close();

        if (ioe == null) {
            ioe = new IOException("Registered service providers failed to encode "
                + renderedImage + " to " + mimeType);
        }

        throw ioe;
    }

    public Object getTransferData(DataFlavor flavor) throws UnsupportedFlavorException {
        System.out.println("mimeType:" + flavor.getMimeType());
        System.out.println("getPrimaryType:" + flavor.getPrimaryType());
        System.out.println("getHumanPresentableName:" + flavor.getHumanPresentableName());
        System.out.println("getSubType:" + flavor.getSubType());

        if (flavor.getMimeType().equals("image/png; class=java.io.InputStream") && this.bufferedImage != null ) {
            try {
                return this.imageToStandardBytesImpl(this.bufferedImage, CONTENT_TYPE);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
        else {
            throw new UnsupportedFlavorException(flavor);
        }
    }

    public DataFlavor[] getTransferDataFlavors() {
        DataFlavor[] flavors = new DataFlavor[1];
        flavors[0] = new DataFlavor(CONTENT_TYPE, "image");
        return flavors;
    }

    public boolean isDataFlavorSupported( DataFlavor flavor ) {
        return false;
    }
}
