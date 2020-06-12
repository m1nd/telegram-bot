import * as Bot from 'node-telegram-bot-api';
import axios from 'axios';

import shapeTypeDetermination from './utils/newDetermination';
import {
  START,
  FIGURE_TYPES,
  DRESS_CODES,
  INTRO,
  CHECK_FIGURE_TYPE,
  METHODICAL_DESCRIPTION,
  TTL_SEX,
  TTL_SHOULDERS,
  TTL_HIPS,
  TTL_WAIST,
  TTL_CHEST,
  TTL_HEIGHT,
  TTL_SHOE_SIZE,
  TTL_FAT_PERCENTAGE,
  TTL_DRESS_CODE,
  TTL_SEASON,
  TTL_CLOTHES_LAYER,
  TTL_CLOTHES_LIST,

  TXT_INTRO,
  TXT_FIGURE_TYPES,
  TXT_DRESS_CODES,
  TXT_METHODICAL_DESCRIPTION,
  TXT_CHECK_FIGURE_TYPE,
  TXT_DRESS_CODE,
} from './constants';
import User from './models/users';

// const link = 'https://telegra.ph/Sample-Page-03-21-32';
// const getLink = `https://api.telegra.ph/createPage?access_token=b968da509bb76866c35425099bc0989a5ec3b32997d55286c657e6994bbb&title=Sample+Page&author_name=Anonymous&content=[{"tag":"p","children":["Hello,+tadam!!!"]}]&return_content=true`;

const token = process.env.TOKEN;
const FIGURE_TYPE_PATH = 'src/assets/figure_type.jpg';
const ACCESS_TOKEN ='671c8902745c11be2a5d99d54dcd9383272adc9acd44712592c11d3ba0ff';
const LNK_DRESS_CODE = "https://docs.google.com/document/d/1a7q2dBvRW1XDdX_kCJ444CJBhUb6ngC6f0JR2_i1B3A";
let clientStore = {};
let bot;



const getFunctionName = (name: string) => name.split('_')[0]

const getToken = async (): Promise<string> => {
  const result = await axios.get('https://api.telegra.ph/createAccount?short_name=style&author_name=m1nd');
  const accessToken = JSON.stringify(result.data.result.access_token);

  return accessToken;
};

const makeGetRequest = async (content: string): Promise<any> => {
  try {
    const accessToken = await getToken();

    console.log('accessToken => ', accessToken);

    const data = JSON.stringify({
      access_token: ACCESS_TOKEN,
      title: 'Title of page',
      content: [
        {
          tag: 'p',
          children: [content],
        },
        {
          tag: 'img',
          attrs: {
            // src: './..src/assets/figure_type.jpg',
            // src: '/usr/src/app/assets/figure_type.jpg',
            // width: 100,
            // height: 100,
            src: "https://i.ibb.co/5MYR5z8/metrics.png",
            // src: "https://www.gettyimages.com/gi-resources/images/500px/983794168.jpg", 
            alt: "no image"
          }
        },
      ],
      return_content: true,
    });

    const res = await axios.post('https://api.telegra.ph/createPage', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return JSON.stringify(res.data.result.url);
  } catch (error) {
    console.log('ERROR => ', error);
  }
};


const getUserParameters = async (callbackQuery) => {

  const fromId =  callbackQuery.from.id;

  clientStore[fromId] = {
    ...clientStore[fromId],
    sex: callbackQuery.data[0],
  };

  bot.sendMessage(fromId, TTL_SHOULDERS).then(() => {
    bot.once('message', backWidthMsg => {
      clientStore[fromId] = {
        ...clientStore[fromId],
        backWidth: +backWidthMsg.text,
      };
      bot.sendMessage(fromId, TTL_HIPS).then(() => {
        bot.once('message', hipsWidthMsg => {
          clientStore[fromId] = {
            ...clientStore[fromId],
            hipsWidth: +hipsWidthMsg.text,
          };
          bot.sendMessage(fromId, TTL_WAIST).then(() => {
            bot.once('message', waistWidthMsg => {
              clientStore[fromId] = {
                ...clientStore[fromId],
                waistWidth: +waistWidthMsg.text,
              };
              bot.sendMessage(fromId, TTL_CHEST).then(() => {
                bot.once('message', chestMsg => {
                  clientStore[fromId] = {
                    ...clientStore[fromId],
                    chest: +chestMsg.text,
                  };
                  bot.sendMessage(fromId, TTL_HEIGHT).then(() => {
                    bot.once('message', heightMsg => {
                      clientStore[fromId] = {
                        ...clientStore[fromId],
                        height: +heightMsg.text,
                      };
                      bot.sendMessage(fromId, TTL_SHOE_SIZE).then(() => {
                        bot.once('message', shoeSizeMsg => {
                          clientStore[fromId] = {
                            ...clientStore[fromId],
                            shoeSize: +shoeSizeMsg.text,
                          };
                          bot.sendPhoto(fromId, FIGURE_TYPE_PATH);

                          bot.sendMessage(fromId, TTL_FAT_PERCENTAGE).then(() => {
                            bot.once('message', scaleOfFatMsg => {
                              clientStore[fromId] = {
                                ...clientStore[fromId],
                                scaleOfFat: +scaleOfFatMsg.text,
                              };
                              const shape = shapeTypeDetermination(clientStore[fromId]);
                              const user = new User({
                                telegramId: fromId,
                                ...clientStore[fromId],
                                ...shape,
                              });
                              user.save(err => console.log(err));

                              makeGetRequest(shape.recommendations).then(resp => {
                                bot.sendMessage(fromId, resp).then(() => {
                                  bot.sendMessage(fromId, TTL_DRESS_CODE, {
                                    reply_markup: {
                                      inline_keyboard: [
                                        [
                                          {
                                            text: 'Перейти к выбору дресс-кода',
                                            callback_data: 'dressCode_next',
                                          },
                                          {
                                            text: 'Вернуться к определению типа внешности',
                                            callback_data: 'dressCode_back',
                                          },
                                        ],
                                      ],
                                    },
                                  });
                                })
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });

}

const getDressCode = async (callbackQuery) => {
  const fromId =  callbackQuery.from.id;

  bot.sendMessage(fromId, TXT_DRESS_CODE).then(() => {

    bot.sendMessage(fromId, LNK_DRESS_CODE, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Business',
              callback_data: 'dcType_business',
            },
          ],
          [
            {
              text: 'Business-casual',
              callback_data: 'dcType_business-casual',
            },
          ],
          [
            {
              text: 'Casual',
              callback_data: 'dcType_casual',
            },
          ],
          [
            {
              text: 'Ultra-casual',
              callback_data: 'dcType_ultra-casual',
            },
          ],
          [
            {
              text: 'Sport',
              callback_data: 'dcType_sport',
            },
          ],
        ],
      },
    });

  });
}

const getDressCodeType = async (callbackQuery) => {
  const fromId =  callbackQuery.from.id;

    bot.sendMessage(fromId, TTL_SEASON, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Summer/Indoor',
              callback_data: 'season_summer',
            },
            {
              text: 'Autumn/Spring',
              callback_data: 'season_autumn',
            },
            {
              text: 'Winter',
              callback_data: 'season_winter',
            },
          ],
        ],
      },
    });

};

const getSeason = async (callbackQuery) => {
  const fromId =  callbackQuery.from.id;

  bot.sendMessage(fromId, TTL_CLOTHES_LAYER, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Верхняя одежда',
            callback_data: 'clothesLayer_outerwear',
          },
          {
            text: 'Основная',
            callback_data: 'clothesLayer_basic',
          },
          {
            text: 'Нижнее бельё',
            callback_data: 'clothesLayer_underwear',
          },
          {
            text: 'Аксессуары',
            callback_data: 'clothesLayer_accessories',
          },
        ],
      ],
    },
  });

}

const getClothesLayer = async (callbackQuery) => {
  const fromId =  callbackQuery.from.id;

  bot.sendMessage(fromId, TTL_CLOTHES_LIST);

}

const stateFunctions = {
  dressCode: getDressCode,
  userParam: getUserParameters,
  dcType: getDressCodeType,
  season: getSeason,
  clothesLayer: getClothesLayer,
};

if (process.env.NODE_ENV === 'production') {
  bot = new Bot(token);
  bot.setWebHook(process.env.HEROKU_URL + ':' + process.env.PORT + '/' + bot.token);
} else {
  bot = new Bot(token, { polling: true });
}

console.log('Bot server started in the ' + process.env.NODE_ENV + ' mode');

bot.onText(new RegExp(FIGURE_TYPES, 'i'), msg => {
  const fromId = msg.from.id;
  bot.sendMessage(fromId, TXT_FIGURE_TYPES);
});

bot.onText(new RegExp(DRESS_CODES, 'i'), msg => {
  const fromId = msg.from.id;
  bot.sendMessage(fromId, TXT_DRESS_CODES);
});

bot.onText(new RegExp(METHODICAL_DESCRIPTION, 'i'), msg => {
  const fromId = msg.from.id;
  bot.sendMessage(fromId, TXT_METHODICAL_DESCRIPTION);
  bot.sendPhoto(fromId, 'assets/history.png');
});

bot.onText(new RegExp(CHECK_FIGURE_TYPE, 'i'), msg => {
  const fromId = msg.from.id;
  bot.sendMessage(fromId, TXT_CHECK_FIGURE_TYPE);
  bot.sendPhoto(fromId, 'assets/metrics.png');
});

bot.onText(new RegExp(INTRO, 'i'), async msg => {
  const fromId = msg.from.id;
  bot.sendMessage(fromId, TXT_INTRO);
  //  User.find({ telegramId: fromId  }, (err, user) => {
  //    console.log(`User =>  ${user}`);
  //  })

  const u = await User.find({ telegramId: fromId });
  console.log(u);

  // console.log(shapeTypeDetermination({
  //   backWidth: 30,
  //   waistWidth: 60,
  //   hipsWidth: 80,
  //   height: 180,
  //   scaleOfFat: 2,
  //   sex: 'm',
  // }));
});

bot.onText(new RegExp(START, 'i'), msg => {
  const fromId = msg.from.id;
  bot.sendMessage(fromId, TTL_SEX, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Мужской',
            callback_data: 'userParam_male',
          },
          {
            text: 'Женский',
            callback_data: 'userParam_female',
          },
        ],
      ],
    },
  });
});

bot.on('callback_query', async (callbackQuery) => {

  stateFunctions[getFunctionName(callbackQuery.data)](callbackQuery);

});

// bot.onText(/\/echo (.+) (.+)/, (msg, match) => {
//   const fromId = msg.from.id; // Получаем ID отправителя
//   const resp = `first => ${match[1]} | second => ${match[2]}`; // Получаем текст после /echo
//   bot.sendMessage(fromId, resp).then(sended => {
//     var chatId = sended.chat.id;
//     var messageId = sended.message_id;
//     bot.onReplyToMessage(chatId, messageId, function(message) {
//       sendMessage(fromId, `User is ${message.text} years old`);
//     });
//   });
// });

// bot.onText(/\/cat/, msg => {
//   const fromId = msg.from.id;
//   bot.sendPhoto(fromId, "https://unsplash.com/photos/R9u7r7nvnVo");
// });

module.exports = bot;
