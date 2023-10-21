import java.awt.Color;
import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.Point;
import java.awt.Toolkit;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.event.MouseMotionListener;

import javax.swing.JFrame;
import javax.swing.JPanel;

import static java.awt.event.KeyEvent.VK_ESCAPE;

public class TransparentPanel extends JPanel implements KeyListener, MouseListener, MouseMotionListener {
    Point stratPoint;
    Point endPoint;
    public void keyPressed(KeyEvent e) {
        printEventInfo("Key Pressed", e);

    }

    public void keyReleased(KeyEvent e) {
        // TODO Auto-generated method stub

    }

    public void keyTyped(KeyEvent e) {
        // TODO Auto-generated method stub
        printEventInfo("Key Typed", e);

    }

    private void printEventInfo(String str, KeyEvent e) {
        System.out.println(str);
        int code = e.getKeyCode();
        System.out.println("   Code: " + KeyEvent.getKeyText(code));
        System.out.println("   Char: " + e.getKeyChar());

        if (code == VK_ESCAPE) {
            System.exit(0);
        }
    }

    @Override
    public void mouseClicked(MouseEvent e) {

    }

    @Override
    public void mousePressed(MouseEvent e) {
        stratPoint = e.getPoint();
    }

    @Override
    public void mouseReleased(MouseEvent e) {
        stratPoint = null;
        endPoint = null;
    }

    @Override
    public void mouseEntered(MouseEvent e) {

    }

    @Override
    public void mouseExited(MouseEvent e) {

    }

    @Override
    public void mouseDragged(MouseEvent e) {
        endPoint = e.getPoint();
        e.getComponent().repaint();
    }

    @Override
    public void mouseMoved(MouseEvent e) {

    }

    public void paint(Graphics g) {
        super.paint(g);
        System.out.println(">>> " + g);
        if (stratPoint != null) {
            int x = Math.min(stratPoint.x, endPoint.x);
            int y = Math.min(stratPoint.y, endPoint.y);
            int width = Math.abs(stratPoint.x - endPoint.x);
            int height = Math.abs(stratPoint.y - endPoint.y);
            g.setColor(Color.black);
            g.drawRect(x, y, width, height);
            System.out.println(g);
        }
    }

    public static void main(String[] args) {
        JFrame frame = new JFrame("Hello");
        frame.setDefaultCloseOperation(javax.swing.WindowConstants.HIDE_ON_CLOSE);
        frame.setUndecorated(true);
        frame.setAlwaysOnTop(true);
        frame.setType(javax.swing.JFrame.Type.UTILITY);
        frame.getRootPane().putClientProperty("apple.awt.draggableWindowBackground", false);
        frame.setLocation(0, 0); // 1620 780
        Dimension screenSize = Toolkit.getDefaultToolkit().getScreenSize();
        frame.setSize(screenSize);
        TransparentPanel contentPane = new TransparentPanel();
        frame.addKeyListener(contentPane);
        contentPane.addMouseListener(contentPane);
        contentPane.addMouseMotionListener(contentPane);
        frame.setContentPane(contentPane);
        frame.setBackground(new Color(0, 0, 0, 0));
        frame.setVisible(true);
    }
}
