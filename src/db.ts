import * as mongoose from 'mongoose';

const options = {
  useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 500,
  connectTimeoutMS: 10000,
};

export default (url: string) => {
  const connect = () => {
                  mongoose
                    .connect(url, options)
                    .then(() => console.log('MongoDB is connected to '))
                    .catch((err) => console.log(err));
  };

  connect();

  mongoose.connection.on('disconnected',connect);

}