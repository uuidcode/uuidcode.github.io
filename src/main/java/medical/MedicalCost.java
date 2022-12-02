package medical;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.image.BufferedImage;
import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import javax.imageio.ImageIO;

import com.google.gson.Gson;

public class MedicalCost {
    private final int fontSize = 14;
    private final int fontSpace = 19;
    private Graphics g;
    private Info info;
    private Person person;
    private Person owner;
    private String year;
    private String month;
    private String day;

    public static MedicalCost of() {
        return new MedicalCost();
    }

    public static void main(String[] args) throws Exception {
        MedicalCost.of()
            .init()
            .drawPage1()
            .drawPage2()
            .drawPersonAgreement()
            .drawOwnerAgreement();
    }

    private MedicalCost init() {
        IntStream.rangeClosed(1, 4)
            .forEach(i -> new File(i + ".png").delete());

        InputStream inputStream = this.getClass().getResourceAsStream("/info.json");
        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
        String json = reader.lines().collect(Collectors.joining());

        this.info = new Gson().fromJson(json, Info.class);
        List<Person> personList = info.getPersonList();

        this.owner = personList.stream()
            .filter(Person::isOwner)
            .findFirst().orElse(null);

        this.person = personList.stream()
            .filter(p -> info.getPersonName().equals(p.getName()))
            .findFirst().orElse(null);

        LocalDateTime localDateTime = LocalDateTime.now();
        this.year = String.valueOf(localDateTime.getYear());
        this.month = String.valueOf(localDateTime.getMonth().getValue());
        this.day = String.valueOf(localDateTime.getDayOfMonth());

        this.month = this.prependZero(this.month);
        this.day = this.prependZero(this.day);

        return this;
    }

    private MedicalCost draw(int page, Runnable runnable) {
        String fileName = page + ".png";
        InputStream inputStream = this.getClass().getResourceAsStream("/" + fileName);
        BufferedImage bufferedImage;
        
        try {
            bufferedImage = ImageIO.read(inputStream);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        
        this.g = bufferedImage.getGraphics();
        g.setColor(Color.BLACK);
        g.setFont(new Font("Batang", Font.PLAIN, fontSize));

        runnable.run();

        try {
            ImageIO.write(bufferedImage, "png", new File(fileName));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return this;
    }
    
    private MedicalCost drawPage1() {
        return this.draw(1, () -> {
            this.drawPerson(person, 150, 107);
            this.drawPerson(owner, 150, 181);
            
            this.drawCheck(108, 205);
            this.drawCheck(165, 357);
            this.drawCheck(495, 645);
            
            this.drawBank();
            this.drawDisease();
            this.drawDate(person);
        });
    }

    private MedicalCost drawPage2() {
        return this.draw(2, () -> {
            int left = 476;
            this.drawCheck(left, 319);
            this.drawCheck(left, 386);
            this.drawCheck(left, 475);
        });
    }

    private MedicalCost drawPersonAgreement() {
        return this.drawAgreement(3, this.person);
    }

    private MedicalCost drawOwnerAgreement() {
        if (this.info.getPersonName().equals(this.owner.getName())) {
            return this;
        }

        return this.drawAgreement(4, this.owner);
    }

    private MedicalCost drawAgreement(int page, Person person) {
        return this.draw(page, () -> {
            int left = 476;
            this.drawCheck(left, 115);
            this.drawCheck(left, 183);
            this.drawCheck(left, 271);
            this.drawCheck(left, 347);
            this.drawCheck(left, 538);
            this.drawCheck(left, 578);
            this.drawCheck(left, 679);
            this.drawAgreement(person);
        });
    }

    private void drawDisease() {
        g.drawString(info.getName(), 120, 420);
        g.drawString(info.getName(), 350, 430);
    }

    private void drawCheck(int left, int top) {
        g.drawString("V", left, top);
    }

    private String prependZero(String value) {
        if (value.length() == 2) {
            return value;
        }

        return "0" + value;
    }

    private void drawDate(Person person) {
        int top = 736;

        drawNumber(this.year, 105, top);
        drawNumber(this.month, 190, top);
        drawNumber(this.day, 235, top);

        g.drawString(person.getName(), 370, top);
        g.drawString(person.getName(), 460, top);
    }

    private void drawAgreement(Person person) {
        int top = 734;
        int nameTop = 710;

        drawNumber(this.year, 155, top);
        drawNumber(this.month, 245, top);
        drawNumber(this.day, 300, top);

        g.drawString(person.getName(), 440, nameTop);
        g.drawString(person.getName(), 500, nameTop);
    }

    private void drawBank() {
        int top = 585;
        Bank bank = this.owner.getBank();

        g.drawString(bank.getName(), 145, top);
        g.drawString(bank.getNumber(), 250, top);
        g.drawString(person.getName(), 480, top);
    }
    private void drawNumber(String number, int left, int top) {
        AtomicInteger index = new AtomicInteger();

        Arrays.stream(number.split(""))
            .forEach(t -> {
                g.drawString(t, left + fontSpace * index.getAndAdd(1), top);
            });
    }

    private void drawPerson(Person person, int left, int top) {
        g.drawString(person.getName(), left, top);
        drawNumber(person.getNumber1(), left + 128, top);
        drawNumber(person.getNumber2(), left + 248, top);

        if (person.isOwner()) {
            int phoneLeft = 140;
            int phoneTop = 230;

            drawNumber(person.getPhone1(), phoneLeft, phoneTop);
            drawNumber(person.getPhone2(), phoneLeft + 67, phoneTop);
            drawNumber(person.getPhone3(), phoneLeft + 150,  phoneTop);
        }
    }
}
