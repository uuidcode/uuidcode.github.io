let data = {
    list: [
        'ted',
        'krystal',
        'messi',
        'tube',
        'kale',
        'ciao',
        'stuart'
    ]
};

data.list.sort(() => Math.random() - 0.5);

let app = new Vue({
    el: '#app',
    data: data
});