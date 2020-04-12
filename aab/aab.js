var app = new Vue({
    el: '#app',
    data: {
        jewelryList: [
            {
                styleObject: {
                    position: 'absolute',
                    left: '0px',
                    top: '0px',
                    width: '200px',
                    height: '160px',
                    backgroundImage: 'url(image/j1.png)'
                }
            },
            {
                styleObject: {
                    position: 'absolute',
                    left: '200px',
                    top: '0px',
                    width: '200px',
                    height: '160px',
                    backgroundImage: 'url(image/j2.png)'
                }
            }
        ]
        ,
        buildingList:[
            {
                styleObject: {
                    position: 'absolute',
                    left: '600px',
                    top: '200px',
                    width: '100px',
                    height: '100px',
                    backgroundImage: 'url(image/1.png)'
                }
            }
        ],
        policeList:[
            {
                styleObject: {
                    position: 'absolute',
                    left: '300px',
                    top: '380px',
                    width: '80px',
                    height: '80px',
                    backgroundImage: 'url(image/d.png)'
                }
            },
            {
                styleObject: {
                    position: 'absolute',
                    left: '380px',
                    top: '380px',
                    width: '80px',
                    height: '80px',
                    backgroundImage: 'url(image/e.png)'
                }
            },
            {
                styleObject: {
                    position: 'absolute',
                    left: '460px',
                    top: '380px',
                    width: '80px',
                    height: '80px',
                    backgroundImage: 'url(image/f.png)'
                }
            }
        ],
        burglarList:[
            {
                styleObject: {
                    position: 'absolute',
                    left: '300px',
                    top: '300px',
                    width: '80px',
                    height: '80px',
                    backgroundImage: 'url(image/a.png)'
                }
            },
            {
                styleObject: {
                    position: 'absolute',
                    left: '380px',
                    top: '300px',
                    width: '80px',
                    height: '80px',
                    backgroundImage: 'url(image/b.png)'
                }
            },
            {
                styleObject: {
                    position: 'absolute',
                    left: '460px',
                    top: '300px',
                    width: '80px',
                    height: '80px',
                    backgroundImage: 'url(image/c.png)'
                }
            }
        ],
        cellList: [
            {
                index: 0,
                title: '아지트',
                styleObject: {
                    position: 'absolute',
                    left: '1600px',
                    top: '700px',
                    width: '150px',
                    height: '150px',
                    textAlign: 'center',
                    lineHeight: '150px',
                    border: '2px solid red'
                }
            },
            {
                index: 1,
                title: '경찰위협',
                subTitle: '도둑은 보석이 있는 건물 한곳을 알 수 있다.',
                styleObject: {
                    position: 'absolute',
                    left: '1600px',
                    top: '650px',
                    width: '150px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black',
                    fontSize: '12px'
                },

            },
            {
                index: 2,
                styleObject: {
                    position: 'absolute',
                    left: '1600px',
                    top: '600px',
                    width: '150px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                },
                trick: true
            },
            {
                index: 3,
                styleObject: {
                    position: 'absolute',
                    left: '1600px',
                    top: '550px',
                    width: '150px',
                    height: '150px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 4,
                styleObject: {
                    position: 'absolute',
                    left: '1450px',
                    top: '600px',
                    width: '150px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 5,
                styleObject: {
                    position: 'absolute',
                    left: '1300px',
                    top: '600px',
                    width: '150px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 6,
                title: '버스를 탔다.',
                subTitle: '4칸 앞으로 가서 지시에 따른다.',
                styleObject: {
                    position: 'absolute',
                    left: '1150px',
                    top: '600px',
                    width: '150px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                styleObject: {
                    position: 'absolute',
                    left: '800px',
                    top: '900px',
                    width: '100px',
                    height: '100px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                styleObject: {
                    position: 'absolute',
                    left: '800px',
                    top: '1000px',
                    width: '100px',
                    height: '100px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                styleObject: {
                    position: 'absolute',
                    left: '800px',
                    top: '1100px',
                    width: '100px',
                    height: '100px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                title: '도둑은 위치 이동을 한다.',
                styleObject: {
                    position: 'absolute',
                    left: '1100px',
                    top: '600px',
                    width: '100px',
                    height: '100px',
                    backgroundColor: 'red',
                    color: 'white',
                    textAlign: 'center',
                    border: '1px solid black'
                },
                move: true,
                target: 'burglar',
                trick: true
            },
            {
                styleObject: {
                    position: 'absolute',
                    left: '1100px',
                    top: '500px',
                    width: '100px',
                    height: '100px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                styleObject: {
                    position: 'absolute',
                    left: '1100px',
                    top: '400px',
                    width: '100px',
                    height: '100px',
                    textAlign: 'center',
                    border: '1px solid black'
                },
                trick: true
            },
            {
                title: '멈춤',
                subTitle: '주사위 수가 남아도 반드시 멈춘다',
                styleObject: {
                    position: 'absolute',
                    left: '1000px',
                    top: '400px',
                    width: '100px',
                    height: '100px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                styleObject: {
                    position: 'absolute',
                    left: '900px',
                    top: '400px',
                    width: '100px',
                    height: '100px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                styleObject: {
                    position: 'absolute',
                    left: '800px',
                    top: '400px',
                    width: '100px',
                    height: '100px',
                    textAlign: 'center',
                    border: '1px solid black'
                },
                trick: true
            },
            {
                styleObject: {
                    position: 'absolute',
                    left: '1000px',
                    top: '600px',
                    width: '100px',
                    height: '100px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                title: '보석을 떨어뜨렸다',
                subTitle: '도둑이 보석을 가지고 있으면 경찰에게 주고 경찰은 다시 숨긴다.',
                styleObject: {
                    position: 'absolute',
                    left: '900px',
                    top: '600px',
                    width: '100px',
                    height: '100px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                styleObject: {
                    position: 'absolute',
                    left: '800px',
                    top: '600px',
                    width: '100px',
                    height: '100px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                title: '주민신고!!',
                subTitle: '경찰은 도둑의 1칸 앞으로 간다.',
                styleObject: {
                    position: 'absolute',
                    left: '700px',
                    top: '400px',
                    width: '100px',
                    height: '100px',
                    textAlign: 'center',
                    backgroundColor: 'skyblue',
                    border: '1px solid black'
                }
            },
            {
                styleObject: {
                    position: 'absolute',
                    left: '600px',
                    top: '400px',
                    width: '100px',
                    height: '100px',
                    textAlign: 'center',
                    border: '1px solid black'
                },
                trick: true
            },
            {
                styleObject: {
                    position: 'absolute',
                    left: '600px',
                    top: '300px',
                    width: '100px',
                    height: '100px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            }
        ]
    }
});

var $app = $('#app');
var $dic = $('<div></div>');
$dic.attr('id', 'die');
$app.append($dic);

var die = new Die();
$app.append(die.$element);