var name = new Date().toISOString();

jQuery.ajax({
    url: 'https://ted-brunch-api.dev.daum.net/v1/upload/url',
    type: 'POST',
    dataType: 'json',
    xhrFields: {
        withCredentials: true
    },
    data: {
        url: 'https://picsum.photos/1000/1000/?random'
    },
    success: function(json) {
        console.log(json);

        jQuery.ajax({
            url: "https://ted-brunch-api.dev.daum.net/v1/article",
            type: "POST",
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            data: {
                title: name,
                subTitle: name,
                status: "publish",
                content: "<div class=\"wrap_cover cover_init\"><div class=\"cover_item cover_direction_left cover_half\" data-app=\"{&quot;type&quot;:&quot;cover&quot;,&quot;kind&quot;:&quot;cover_half&quot;,&quot;align&quot;:&quot;left&quot;,&quot;title&quot;:{&quot;style&quot;:{},&quot;data&quot;:[{&quot;type&quot;:&quot;text&quot;,&quot;text&quot;:&quot;" + name + "&quot;}],&quot;text&quot;:&quot;" + name + "&quot;},&quot;title-sub&quot;:{&quot;style&quot;:{},&quot;data&quot;:[{&quot;type&quot;:&quot;text&quot;,&quot;text&quot;:&quot;" + name + "&quot;}],&quot;text&quot;:&quot;" + name + "&quot;},&quot;plain&quot;:{&quot;title&quot;:&quot;" + name + "&quot;,&quot;title-sub&quot;:&quot;" + name + "&quot;},&quot;style&quot;:{&quot;background-image&quot;:&quot;http://t1.daumcdn.net/brunch/test/user/2VM/image/3zOdB5eb9yzQQwScaqheZ5g6ZP8.jpg&quot;},&quot;width&quot;:1024,&quot;height&quot;:768}\"><div class=\"cover_image\" style=\"background-image: url(&quot;//t1.daumcdn.net/thumb/R1280x0/?fname=http%3A%2F%2Ft1.daumcdn.net%2Fbrunch%2Ftest%2Fuser%2F2VM%2Fimage%2F3zOdB5eb9yzQQwScaqheZ5g6ZP8.jpg&quot;);\"></div><div class=\"cover_inner\"></div><div class=\"cover_cell cover_direction_left\"><h1 class=\"cover_title\">" + name + "</h1><div class=\"cover_sub_title\">" + name + "</div></div></div></div><div class=\"wrap_body text_align_left\"><p class=\"wrap_item item_type_text\" data-app=\"{&quot;type&quot;:&quot;text&quot;,&quot;data&quot;:[{&quot;type&quot;:&quot;text&quot;,&quot;data&quot;:[{&quot;type&quot;:&quot;text&quot;,&quot;text&quot;:&quot;" + name + "&quot;}],&quot;style&quot;:{&quot;background-color&quot;:&quot;#ffffff&quot;,&quot;color&quot;:&quot;#333333&quot;,&quot;font-family&quot;:&quot;Nanum Myeongjo&quot;}}]}\"><span style=\"color: rgb(51, 51, 51); background-color: rgb(255, 255, 255); font-family: &quot;Nanum Myeongjo&quot;;\">" + name + "</span></p></div>",
                contentSummary: name,
                contentType: "html",
                images: "[{\"url\":\"" + json.data.url + "\",\"type\":\"cover\",\"width\":1000,\"height\":1000}]",
                videos: "[]",
                keywords: "[{\"sequence\":1,\"no\":93860,\"keyword\":\"감성사진\"}]",
                magazineNo: 0
            },
            success: function(json) {
                console.log(json);
            }
        });
    }
});