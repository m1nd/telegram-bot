import * as Bot from 'node-telegram-bot-api';
// import * as axios from 'axios';
import axios from 'axios';

import shapeTypeDetermination from "./utils/newDetermination";
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
  TXT_INTRO,
  TXT_FIGURE_TYPES,
  TXT_DRESS_CODES,
  TXT_METHODICAL_DESCRIPTION,
  TXT_CHECK_FIGURE_TYPE,
} from './constants';
import User from './models/users';

// const f = async () => {
//   return 23;
// }

async function makeGetRequest() {
  
  let res = await axios.get(getLink);

  return JSON.stringify(res.data.result.url);

}

const token = process.env.TOKEN;
let clientStore = {};
let bot;

// const link = 'https://telegra.ph/Sample-Page-03-21-32';

const getLink = `https://api.telegra.ph/createPage?access_token=b968da509bb76866c35425099bc0989a5ec3b32997d55286c657e6994bbb&title=Sample+Page&author_name=Anonymous&content=[{"tag":"p","children":["Hello,+tadam!!!"]}]&return_content=true`;

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
            callback_data: 'male',
          },
          {
            text: 'Женский',
            callback_data: 'female',
          },
        ],
      ],
    },
  });
});

bot.on('callback_query', callbackQuery => {
  clientStore[callbackQuery.from.id] = {
    ...clientStore[callbackQuery.from.id],
    sex: callbackQuery.data[0],
  };
  bot.sendMessage(callbackQuery.from.id, TTL_SHOULDERS).then(() => {
    bot.once('message', backWidthMsg => {
      clientStore[backWidthMsg.from.id] = {
        ...clientStore[backWidthMsg.from.id],
        backWidth: +backWidthMsg.text,
      };
      bot.sendMessage(backWidthMsg.from.id, TTL_HIPS).then(() => {
        bot.once('message', hipsWidthMsg => {
          clientStore[hipsWidthMsg.from.id] = {
            ...clientStore[hipsWidthMsg.from.id],
            hipsWidth: +hipsWidthMsg.text,
          };
          bot.sendMessage(hipsWidthMsg.from.id, TTL_WAIST).then(() => {
            bot.once('message', waistWidthMsg => {
              clientStore[waistWidthMsg.from.id] = {
                ...clientStore[waistWidthMsg.from.id],
                waistWidth: +waistWidthMsg.text,
              };
              bot.sendMessage(waistWidthMsg.from.id, TTL_CHEST).then(() => {
                bot.once('message', chestMsg => {
                  clientStore[chestMsg.from.id] = {
                    ...clientStore[chestMsg.from.id],
                    chest: +chestMsg.text,
                  };
                  bot.sendMessage(chestMsg.from.id, TTL_HEIGHT).then(() => {
                    bot.once('message', heightMsg => {
                      clientStore[heightMsg.from.id] = {
                        ...clientStore[heightMsg.from.id],
                        height: +heightMsg.text,
                      };
                      bot.sendMessage(heightMsg.from.id, TTL_SHOE_SIZE).then(() => {
                        bot.once('message', shoeSizeMsg => {
                          clientStore[shoeSizeMsg.from.id] = {
                            ...clientStore[shoeSizeMsg.from.id],
                            shoeSize: +shoeSizeMsg.text,
                          };
                          bot.sendPhoto(shoeSizeMsg.from.id, 'src/assets/figure_type.jpg');
                          
                          // const lnk = axios.get(getLink)
                          //     .then((res) => {
                          //       return JSON.stringify(res.data.result.url);

                          //     })
                          //     .catch((error) => {
                          //       console.error(error)
                          //     });
                          const lnk = makeGetRequest();
                          


                          bot.sendMessage(shoeSizeMsg.from.id, TTL_FAT_PERCENTAGE).then(() => {
                            bot.once('message', scaleOfFatMsg => {
                              clientStore[scaleOfFatMsg.from.id] = {
                                ...clientStore[scaleOfFatMsg.from.id],
                                scaleOfFat: +scaleOfFatMsg.text,
                              };
                              console.log('LNK => ', lnk);
                              bot.sendMessage(scaleOfFatMsg.from.id, lnk);
                              // axios.get(getLink)
                              // .then((res) => {
                              //   console.log(`content => : ${JSON.stringify(res.data.result.url)}`)

                              // })
                              // .catch((error) => {
                              //   console.error(error)
                              // });
                              console.log('STart =>>>', scaleOfFatMsg.from.id);
                              const shape = shapeTypeDetermination(clientStore[scaleOfFatMsg.from.id]);
                              const user = new User({
                                telegramId: scaleOfFatMsg.from.id,
                                ...clientStore[scaleOfFatMsg.from.id],
                              ...shape,
                              });
                              user.save(err => console.log(err));
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
