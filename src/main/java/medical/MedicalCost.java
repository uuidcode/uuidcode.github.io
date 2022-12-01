package medical;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.image.BufferedImage;
import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import javax.imageio.ImageIO;

import com.google.gson.Gson;

public class MedicalCost {
    static int fontSize = 14;
    static int fontSpace = 19;

    public static void main(String[] args) throws Exception {
        String name = "성귀임";

        BufferedReader reader = new BufferedReader(new InputStreamReader(MedicalCost.class.getResourceAsStream("/info.json")));
        String json = reader.lines().collect(Collectors.joining());

        Info info = new Gson().fromJson(json, Info.class);
        List<Person> personList = info.getPersonList();

        Person owner = personList.stream()
            .filter(Person::isOwner)
            .findFirst().orElse(null);

        Person person = personList.stream()
            .filter(p -> name.equals(p.getName()))
            .findFirst().orElse(null);

        BufferedImage bufferedImage = ImageIO.read(MedicalCost.class.getResourceAsStream("/1.png"));
        Graphics g = bufferedImage.getGraphics();
        g.setColor(Color.BLACK);

        g.setFont(new Font("Batang", Font.PLAIN, fontSize));

        draw(g, person, 150, 107);
        draw(g, owner, 150, 181);
        g.drawString("V", 108, 205);
        g.drawString("V", 165, 357);
        g.drawString(info.getName(), 120, 420);
        g.drawString(info.getName(), 350, 430);

        ImageIO.write(bufferedImage, "png", new File("1.png"));
    }

    private static void drawNumber(Graphics g, String number, int left, int top) {
        AtomicInteger index = new AtomicInteger();

        Arrays.stream(number.split(""))
            .forEach(t -> {
                g.drawString(t, left + fontSpace * index.getAndAdd(1), top);
            });
    }

    private static void draw(Graphics g, Person person, int left, int top) {
        g.drawString(person.getName(), left, top);
        drawNumber(g, person.getNumber1(), left + 128, top);
        drawNumber(g, person.getNumber2(), left + 248, top);

        if (person.isOwner()) {
            int phoneLeft = 140;
            int phoneTop = 230;

            drawNumber(g, person.getPhone1(), phoneLeft, phoneTop);
            drawNumber(g, person.getPhone2(), phoneLeft + 67, phoneTop);
            drawNumber(g, person.getPhone3(), phoneLeft + 150,  phoneTop);
        }
    }
}
