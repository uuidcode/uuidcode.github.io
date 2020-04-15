var app = new Vue({
    el: '#app',
    data: {
        jewelryList: [
            {
                styleObject: {
                    position: 'absolute',
                    left: '2000px',
                    top: '0px',
                    width: '200px',
                    height: '160px',
                    backgroundImage: 'url(image/j1.png)'
                }
            },
            {
                styleObject: {
                    position: 'absolute',
                    left: '2200px',
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
                    left: '1300px',
                    top: '250px',
                    width: '100px',
                    height: '100px',
                    backgroundImage: 'url(image/1.png)'
                }
            },
            {
                styleObject: {
                    position: 'absolute',
                    left: '1100px',
                    top: '580px',
                    width: '100px',
                    height: '100px',
                    backgroundImage: 'url(image/2.png)'
                }
            },
            {
                styleObject: {
                    position: 'absolute',
                    left: '700px',
                    top: '200px',
                    width: '100px',
                    height: '100px',
                    backgroundImage: 'url(image/3.png)'
                }
            },
            {
                styleObject: {
                    position: 'absolute',
                    left: '1200px',
                    top: '50px',
                    width: '100px',
                    height: '100px',
                    backgroundImage: 'url(image/4.png)'
                }
            },
            {
                styleObject: {
                    position: 'absolute',
                    left: '600px',
                    top: '550px',
                    width: '100px',
                    height: '100px',
                    backgroundImage: 'url(image/5.png)'
                }
            },
            {
                styleObject: {
                    position: 'absolute',
                    left: '200px',
                    top: '650px',
                    width: '100px',
                    height: '100px',
                    backgroundImage: 'url(image/6.png)'
                }
            },
            {
                styleObject: {
                    position: 'absolute',
                    left: '300px',
                    top: '100px',
                    width: '100px',
                    height: '100px',
                    backgroundImage: 'url(image/7.png)'
                }
            }
        ],
        policeList:[
            {
                styleObject: {
                    position: 'absolute',
                    left: '2300px',
                    top: '380px',
                    width: '80px',
                    height: '80px',
                    backgroundImage: 'url(image/d.png)'
                }
            },
            {
                styleObject: {
                    position: 'absolute',
                    left: '2380px',
                    top: '380px',
                    width: '80px',
                    height: '80px',
                    backgroundImage: 'url(image/e.png)'
                }
            },
            {
                styleObject: {
                    position: 'absolute',
                    left: '2460px',
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
                    left: '2300px',
                    top: '300px',
                    width: '80px',
                    height: '80px',
                    backgroundImage: 'url(image/a.png)'
                }
            },
            {
                styleObject: {
                    position: 'absolute',
                    left: '2380px',
                    top: '300px',
                    width: '80px',
                    height: '80px',
                    backgroundImage: 'url(image/b.png)'
                }
            },
            {
                styleObject: {
                    position: 'absolute',
                    left: '2460px',
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
                    left: '1800px',
                    top: '700px',
                    width: '100px',
                    height: '100px',
                    textAlign: 'center',
                    lineHeight: '100px',
                    border: '2px solid red'
                }
            },
            {
                index: 1,
                subTitle: '도둑은 보석이 있는 건물 한곳을 알 수 있다.',
                styleObject: {
                    position: 'absolute',
                    left: '1800px',
                    top: '650px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black',
                    backgroundColor: 'pink'
                },

            },
            {
                index: 2,
                styleObject: {
                    position: 'absolute',
                    left: '1800px',
                    top: '600px',
                    width: '100px',
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
                    left: '1800px',
                    top: '550px',
                    width: '100px',
                    height: '150px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 4,
                styleObject: {
                    position: 'absolute',
                    left: '1700px',
                    top: '600px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 5,
                styleObject: {
                    position: 'absolute',
                    left: '1600px',
                    top: '600px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 6,
                subTitle: '4칸 앞으로 가서 지시에 따른다.',
                styleObject: {
                    position: 'absolute',
                    left: '1500px',
                    top: '600px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 7,
                styleObject: {
                    position: 'absolute',
                    left: '1500px',
                    top: '650px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 8,
                styleObject: {
                    position: 'absolute',
                    left: '1500px',
                    top: '700px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 9,
                styleObject: {
                    position: 'absolute',
                    left: '1500px',
                    top: '750px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 10,
                subTitle: '도둑은 위치 이동을 한다.',
                titleStyleObject: {
                  fontSize: '13px'
                },
                styleObject: {
                    position: 'absolute',
                    left: '1800px',
                    top: '500px',
                    width: '100px',
                    height: '50px',
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
                index: 11,
                styleObject: {
                    position: 'absolute',
                    left: '1800px',
                    top: '450px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 12,
                styleObject: {
                    position: 'absolute',
                    left: '1800px',
                    top: '400px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                },
                trick: true
            },
            {
                index: 13,
                subTitle: '주사위 수가 남아도 반드시 멈춘다',
                styleObject: {
                    position: 'absolute',
                    left: '1700px',
                    top: '400px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 14,
                styleObject: {
                    position: 'absolute',
                    left: '1600px',
                    top: '400px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 15,
                styleObject: {
                    position: 'absolute',
                    left: '1500px',
                    top: '400px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                },
                trick: true
            },
            {
                index: 16,
                styleObject: {
                    position: 'absolute',
                    left: '1700px',
                    top: '500px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 17,
                subTitle: '도둑이 보석을 가지고 있으면 경찰에게 주고 경찰은 다시 숨긴다.',
                styleObject: {
                    position: 'absolute',
                    left: '1600px',
                    top: '500px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black',
                    fontSize: '12px'
                }
            },
            {
                index: 18,
                styleObject: {
                    position: 'absolute',
                    left: '1500px',
                    top: '500px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 19,
                subTitle: '경찰은 도둑의 1칸 앞으로 간다.',
                styleObject: {
                    position: 'absolute',
                    left: '1400px',
                    top: '400px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    backgroundColor: 'skyblue',
                    border: '1px solid black'
                }
            },
            {
                index: 20,
                styleObject: {
                    position: 'absolute',
                    left: '1300px',
                    top: '400px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                },
                trick: true
            },
            {
                index: 21,
                subTitle: '도둑은 아지트로 경찰은 감옥으로',
                styleObject: {
                    position: 'absolute',
                    left: '1200px',
                    top: '400px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black',
                    fontSize: '12px'
                },
                comeBackHome: true
            },
            {
                index: 22,
                styleObject: {
                    position: 'absolute',
                    left: '1100px',
                    top: '400px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                },
                trick: true
            },
            {
                index: 23,
                styleObject: {
                    position: 'absolute',
                    left: '1100px',
                    top: '350px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 24,
                styleObject: {
                    position: 'absolute',
                    left: '1300px',
                    top: '350px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 25,
                subTitle: '도둑은 아지트로 경찰은 감옥으로',
                styleObject: {
                    position: 'absolute',
                    left: '1400px',
                    top: '750px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 26,
                styleObject: {
                    position: 'absolute',
                    left: '1300px',
                    top: '750px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                },
                trick: true
            },
            {
                index: 27,
                styleObject: {
                    position: 'absolute',
                    left: '1300px',
                    top: '700px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                },
            },
            {
                index: 28,
                subTitle: '경찰은 주사위를 던져서 2가 나오면 도둑 한명 체포',
                styleObject: {
                    position: 'absolute',
                    left: '1300px',
                    top: '650px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black',
                    backgroundColor: 'skyblue'
                },
            },
            {
                index: 29,
                styleObject: {
                    position: 'absolute',
                    left: '1300px',
                    top: '600px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                },
                trick: true
            },
            {
                index: 30,
                styleObject: {
                    position: 'absolute',
                    left: '1200px',
                    top: '600px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 39,
                subTitle: '주사위 수가 남아도 반드시 멈춘다',
                styleObject: {
                    position: 'absolute',
                    left: '1300px',
                    top: '550px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 40,
                styleObject: {
                    position: 'absolute',
                    left: '1300px',
                    top: '500px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                },
                trick: true
            },
            {
                index: 41,
                styleObject: {
                    position: 'absolute',
                    left: '1400px',
                    top: '500px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 42,
                subTitle: '경찰은 도둑의 4칸 앞으로 간다.',
                styleObject: {
                    position: 'absolute',
                    left: '1200px',
                    top: '500px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black',
                    backgroundColor: 'skyblue'
                },
            },
            {
                index: 43,
                styleObject: {
                    position: 'absolute',
                    left: '1100px',
                    top: '500px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                },
            },
            {
                index: 44,
                styleObject: {
                    position: 'absolute',
                    left: '1000px',
                    top: '500px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                },
            },
            {
                index: 45,
                title: '2',
                subTitle: '3으로 이동',
                styleObject: {
                    position: 'absolute',
                    left: '900px',
                    top: '500px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black',
                    background: 'orange'
                },
            },
            {
                index: 46,
                styleObject: {
                    position: 'absolute',
                    left: '800px',
                    top: '500px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                },
            },
            {
                index: 47,
                styleObject: {
                    position: 'absolute',
                    left: '700px',
                    top: '500px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                },
            },
            {
                index: 48,
                styleObject: {
                    position: 'absolute',
                    left: '700px',
                    top: '450px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                },
            },
            {
                index: 49,
                styleObject: {
                    position: 'absolute',
                    left: '700px',
                    top: '400px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                },
                trick: true
            },
            {
                index: 50,
                styleObject: {
                    position: 'absolute',
                    left: '1000px',
                    top: '400px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 51,
                title: '3',
                subTitle: '2로 이동',
                styleObject: {
                    position: 'absolute',
                    left: '900px',
                    top: '400px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black',
                    backgroundColor: 'orange'
                }
            },
            {
                index: 52,
                subTitle: '주사위 수가 남아도 반드시 멈춘다',
                styleObject: {
                    position: 'absolute',
                    left: '800px',
                    top: '400px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 53,
                styleObject: {
                    position: 'absolute',
                    left: '700px',
                    top: '350px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 54,
                styleObject: {
                    position: 'absolute',
                    left: '700px',
                    top: '300px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 55,
                subTitle: '경찰은 위치 이동을 한다.',
                styleObject: {
                    position: 'absolute',
                    left: '1100px',
                    top: '300px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black',
                    backgroundColor: 'skyblue'
                },
                movePolice: true,
            },
            {
                index: 56,
                subTitle: '경찰은 위치 이동을 한다.',
                styleObject: {
                    position: 'absolute',
                    left: '1100px',
                    top: '250px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black',
                    backgroundColor: 'blue',
                    color: 'white'
                }
            },
            {
                index: 57,
                subTitle: '도둑은 보석이 있는 건물 한곳을 알 수 있다.',
                styleObject: {
                    position: 'absolute',
                    left: '1100px',
                    top: '250px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black',
                    backgroundColor: 'pink'
                }
            },
            {
                index: 58,
                styleObject: {
                    position: 'absolute',
                    left: '1100px',
                    top: '200px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black',
                }
            },
            {
                index: 59,
                styleObject: {
                    position: 'absolute',
                    left: '1200px',
                    top: '200px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 60,
                styleObject: {
                    position: 'absolute',
                    left: '1300px',
                    top: '200px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                },
                trick: true
            },
            {
                index: 61,
                styleObject: {
                    position: 'absolute',
                    left: '1300px',
                    top: '150px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 62,
                styleObject: {
                    position: 'absolute',
                    left: '1300px',
                    top: '100px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 63,
                styleObject: {
                    position: 'absolute',
                    left: '1500px',
                    top: '350px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 64,
                subTitle: '경찰은 71로 이동',
                styleObject: {
                    position: 'absolute',
                    left: '1500px',
                    top: '300px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black',
                    backgroundColor: 'skyblue'
                }
            },
            {
                index: 65,
                subTitle: '도둑은 72로 이동',
                styleObject: {
                    position: 'absolute',
                    left: '1500px',
                    top: '250px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black',
                    backgroundColor: 'pink'
                }
            },
            {
                index: 66,
                subTitle: '비타민을 먹었다. 5칸 전진',
                styleObject: {
                    position: 'absolute',
                    left: '1500px',
                    top: '200px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                },
                trick: true
            },
            {
                index: 67,
                styleObject: {
                    position: 'absolute',
                    left: '1500px',
                    top: '150px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 68,
                styleObject: {
                    position: 'absolute',
                    left: '1500px',
                    top: '100px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 69,
                styleObject: {
                    position: 'absolute',
                    left: '1500px',
                    top: '50px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 70,
                styleObject: {
                    position: 'absolute',
                    left: '1500px',
                    top: '0px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                },
                trick: true
            },
            {
                index: 71,
                subTitle: '경찰은 64으로 이동',
                styleObject: {
                    position: 'absolute',
                    left: '1800px',
                    top: '350px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black',
                    backgroundColor: 'skyblue'
                }
            },
            {
                index: 72,
                subTitle: '도둑은 65로 이동',
                styleObject: {
                    position: 'absolute',
                    left: '1800px',
                    top: '300px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black',
                    backgroundColor: 'pink'
                }
            },
            {
                index: 73,
                subTitle: '경찰은 주사위를 던져서 3이 나오면 도둑 한명 체포',
                styleObject: {
                    position: 'absolute',
                    left: '1400px',
                    top: '200px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black',
                    backgroundColor: 'skyblue'
                }
            },
            {
                index: 74,
                styleObject: {
                    position: 'absolute',
                    left: '1600px',
                    top: '0px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                },
            },
            {
                index: 75,
                styleObject: {
                    position: 'absolute',
                    left: '1700px',
                    top: '0px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                },
            },
            {
                index: 76,
                styleObject: {
                    position: 'absolute',
                    left: '1800px',
                    top: '0px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                },
                trick: true
            },
            {
                index: 77,
                title: '터널',
                subTitle: '138로 이동',
                styleObject: {
                    position: 'absolute',
                    left: '1800px',
                    top: '250px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black',
                    backgroundColor: 'lightgray'
                },
                trick: true
            },
            {
                index: 78,
                styleObject: {
                    position: 'absolute',
                    left: '1800px',
                    top: '200px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 79,
                subTitle: '경찰은 위치 이동을 한다.',
                styleObject: {
                    position: 'absolute',
                    left: '1800px',
                    top: '150px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black',
                    backgroundColor: 'skyblue'
                },
                movePolice:true,
            },
            {
                index: 80,
                styleObject: {
                    position: 'absolute',
                    left: '1800px',
                    top: '100px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 81,
                styleObject: {
                    position: 'absolute',
                    left: '1800px',
                    top: '50px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 82,
                subTitle: '도둑은 위치 이동을 한다.',
                styleObject: {
                    position: 'absolute',
                    left: '1400px',
                    top: '0px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black',
                    backgroundColor: 'red',
                    color: 'white'
                }
            },
            {
                index: 83,
                styleObject: {
                    position: 'absolute',
                    left: '1300px',
                    top: '0px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 84,
                subTitle: '주사위 수가 남아도 반드시 멈춘다.',
                styleObject: {
                    position: 'absolute',
                    left: '1200px',
                    top: '0px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                },
                stop: true
            },
            {
                index: 84,
                styleObject: {
                    position: 'absolute',
                    left: '1100px',
                    top: '0px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 85,
                styleObject: {
                    position: 'absolute',
                    left: '1000px',
                    top: '0px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 86,
                title: '4',
                subTitle: '1로 이동',
                styleObject: {
                    position: 'absolute',
                    left: '900px',
                    top: '0px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black',
                    backgroundColor: 'orange'
                }
            },
            {
                index: 87,
                styleObject: {
                    position: 'absolute',
                    left: '800px',
                    top: '0px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 88,
                subTitle: '밑에 있는 건물을 뒤져라',
                styleObject: {
                    position: 'absolute',
                    left: '700px',
                    top: '0px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black',
                    backgroundColor: 'pink'
                }
            },
            {
                index: 89,
                styleObject: {
                    position: 'absolute',
                    left: '600px',
                    top: '0px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 90,
                subTitle: '도둑은 위치 이동을 한다.',
                styleObject: {
                    position: 'absolute',
                    left: '500px',
                    top: '0px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black',
                    backgroundColor: 'red',
                    color: 'white'
                },
                move: true,
                moveTarget: 'burglar'
            },
            {
                index: 91,
                styleObject: {
                    position: 'absolute',
                    left: '500px',
                    top: '50px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                },
                trick: true
            },
            {
                index: 92,
                subTitle: '도둑은 위치 이동을 한다.',
                styleObject: {
                    position: 'absolute',
                    left: '500px',
                    top: '100px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black',
                    backgroundColor: 'red',
                    color: 'white'
                }
            },
            {
                index: 93,
                styleObject: {
                    position: 'absolute',
                    left: '500px',
                    top: '150px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black',
                },
                trick: true
            },
            {
                index: 94,
                subTitle: '뒤로 2칸 이동해서 지시에 따른다.',
                styleObject: {
                    position: 'absolute',
                    left: '500px',
                    top: '200px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                },
                back: 2
            },
            {
                index: 95,
                styleObject: {
                    position: 'absolute',
                    left: '500px',
                    top: '250px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 96,
                styleObject: {
                    position: 'absolute',
                    left: '500px',
                    top: '300px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 97,
                subTitle: '경찰은 주사위를 던져서 6이 나오면 도둑 한명 체포',
                styleObject: {
                    position: 'absolute',
                    left: '500px',
                    top: '350px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black',
                    backgroundColor: 'skyblue'
                }
            },
            {
                index: 98,
                subTitle: '경찰은 120으로 이동',
                styleObject: {
                    position: 'absolute',
                    left: '500px',
                    top: '400px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black',
                    backgroundColor: 'skyblue'
                },
                trick: true,
                move: 120,
                moveTarget: 'police'
            },
            {
                index: 99,
                subTitle: '도둑은 121으로 이동',
                styleObject: {
                    position: 'absolute',
                    left: '600px',
                    top: '400px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black',
                    backgroundColor: 'pink'
                },
                move: 121,
                moveTarget: 'buglar'
            },
            {
                index: 100,
                styleObject: {
                    position: 'absolute',
                    left: '1200px',
                    top: '750px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 101,
                subTitle: '경찰은 위치 이동을 한다.',
                styleObject: {
                    position: 'absolute',
                    left: '1100px',
                    top: '750px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black',
                    backgroundColor: 'skyblue'
                },
                movePolice:true,
            },
            {
                index: 102,
                styleObject: {
                    position: 'absolute',
                    left: '1000px',
                    top: '750px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 103,
                title: '1',
                subTitle: '4로 이동',
                styleObject: {
                    position: 'absolute',
                    left: '900px',
                    top: '750px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black',
                    backgroundColor: 'orange'
                },
                move: 86
            },
            {
                index: 104,
                styleObject: {
                    position: 'absolute',
                    left: '800px',
                    top: '750px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 105,
                subTitle: '도둑은 99로 이동',
                styleObject: {
                    position: 'absolute',
                    left: '700px',
                    top: '750px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black',
                    backgroundColor: 'pink'
                },
                move: 99,
                burglarMove: true
            },
            {
                index: 106,
                subTitle: '경창은 98로 이동',
                styleObject: {
                    position: 'absolute',
                    left: '600px',
                    top: '750px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black',
                    backgroundColor: 'skyblue'
                },
                move: 98,
                movePolice: true

            },
            {
                index: 107,
                styleObject: {
                    position: 'absolute',
                    left: '500px',
                    top: '750px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 108,
                styleObject: {
                    position: 'absolute',
                    left: '400px',
                    top: '750px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 109,
                styleObject: {
                    position: 'absolute',
                    left: '400px',
                    top: '700px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 110,
                subTitle: '도둑은 보석을 동료에게 넘겨준다',
                styleObject: {
                    position: 'absolute',
                    left: '400px',
                    top: '650px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black',
                    backgroundColor: 'pink'
                },
                trick: true
            },
            {
                index: 111,
                styleObject: {
                    position: 'absolute',
                    left: '500px',
                    top: '650px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 112,
                styleObject: {
                    position: 'absolute',
                    left: '600px',
                    top: '650px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 113,
                styleObject: {
                    position: 'absolute',
                    left: '400px',
                    top: '600px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 114,
                styleObject: {
                    position: 'absolute',
                    left: '400px',
                    top: '550px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 115,
                styleObject: {
                    position: 'absolute',
                    left: '300px',
                    top: '550px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 116,
                styleObject: {
                    position: 'absolute',
                    left: '200px',
                    top: '550px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                },
                trick: true
            },
            {
                index: 117,
                subTitle: '도둑은 위치 이동을 한다.',
                styleObject: {
                    position: 'absolute',
                    left: '100px',
                    top: '550px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black',
                    backgroundColor: 'red',
                    color: 'white'
                }
            },
            {
                index: 118,
                subTitle: '밥을 먹고 힘이 났다. 3칸 앞으로',
                styleObject: {
                    position: 'absolute',
                    left: '0px',
                    top: '550px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 119,
                styleObject: {
                    position: 'absolute',
                    left: '0px',
                    top: '600px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                },
                trick: true
            },
            {
                index: 120,
                styleObject: {
                    position: 'absolute',
                    left: '0px',
                    top: '650px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 121,
                subTitle: '도둑은 보석이 있는 건물 한곳을 알 수 있다.',
                styleObject: {
                    position: 'absolute',
                    left: '0px',
                    top: '700px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black',
                    backgroundColor: 'pink'
                }
            },
            {
                index: 122,
                subTitle: '도둑은 아지트로 경찰은 감옥으로',
                styleObject: {
                    position: 'absolute',
                    left: '0px',
                    top: '750px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 123,
                subTitle: '도둑은 위치 이동을 한다.',
                styleObject: {
                    position: 'absolute',
                    left: '100px',
                    top: '750px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black',
                    backgroundColor: 'red',
                    color: 'white'
                }
            },
            {
                index: 124,
                styleObject: {
                    position: 'absolute',
                    left: '200px',
                    top: '750px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                },
                trick: true
            },
            {
                index: 125,
                styleObject: {
                    position: 'absolute',
                    left: '300px',
                    top: '750px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 126,
                styleObject: {
                    position: 'absolute',
                    left: '200px',
                    top: '600px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 127,
                styleObject: {
                    position: 'absolute',
                    left: '0px',
                    top: '500px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                },
                trick: true
            },
            {
                index: 128,
                styleObject: {
                    position: 'absolute',
                    left: '0px',
                    top: '450px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 129,
                subTitle: '경찰은 도둑의 1칸 앞으로',
                styleObject: {
                    position: 'absolute',
                    left: '0px',
                    top: '400px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black',
                    backgroundColor: 'skyblue'
                }
            },
            {
                index: 130,
                styleObject: {
                    position: 'absolute',
                    left: '100px',
                    top: '400px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                },
                trick: true
            },
            {
                index: 131,
                styleObject: {
                    position: 'absolute',
                    left: '200px',
                    top: '400px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 132,
                subTitle: '이 칸에 멈추면 1회 휴식',
                styleObject: {
                    position: 'absolute',
                    left: '300px',
                    top: '400px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                },
                rest: true
            },
            {
                index: 133,
                subTitle: '도둑은 위치 이동을 한다.',
                styleObject: {
                    position: 'absolute',
                    left: '400px',
                    top: '400px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black',
                    backgroundColor: 'red',
                    color: 'white'
                },
                moveBurglar: true
            },
            {
                index: 134,
                styleObject: {
                    position: 'absolute',
                    left: '100px',
                    top: '350px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 135,
                subTitle: '도둑은 아지트로 경찰은 감옥으로',
                styleObject: {
                    position: 'absolute',
                    left: '100px',
                    top: '300px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 136,
                subTitle: '도둑은 위치 이동을 한다.',
                styleObject: {
                    position: 'absolute',
                    left: '100px',
                    top: '250px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black',
                    backgroundColor: 'red',
                    color: 'white'
                },
                moveBurglar: true
            },
            {
                index: 137,
                styleObject: {
                    position: 'absolute',
                    left: '100px',
                    top: '200px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 138,
                title: '터널',
                subTitle: '77로 이동',
                styleObject: {
                    position: 'absolute',
                    left: '0px',
                    top: '200px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black',
                    backgroundColor: 'lightgray'
                }
            },
            {
                index: 139,
                styleObject: {
                    position: 'absolute',
                    left: '400px',
                    top: '150px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black',
                }
            },
            {
                index: 140,
                subTitle: '도둑은 보석이 있는 건물 한곳을 알 수 있다.',
                styleObject: {
                    position: 'absolute',
                    left: '400px',
                    top: '50px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black',
                    backgroundColor: 'pink'
                }
            },
            {
                index: 141,
                subTitle: '경찰은 위치 이동을 한다.',
                styleObject: {
                    position: 'absolute',
                    left: '300px',
                    top: '50px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                },
                movePolice:true,
            },
            {
                index: 142,
                styleObject: {
                    position: 'absolute',
                    left: '200px',
                    top: '50px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 143,
                styleObject: {
                    position: 'absolute',
                    left: '100px',
                    top: '50px',
                    width: '100px',
                    height: '50px',
                    textAlign: 'center',
                    border: '1px solid black'
                }
            },
            {
                index: 144,
                title: '경찰서',
                styleObject: {
                    position: 'absolute',
                    left: '0px',
                    top: '0px',
                    width: '100px',
                    height: '100px',
                    textAlign: 'center',
                    border: '2px solid red'
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