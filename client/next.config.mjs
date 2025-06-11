module.exports = {
    webpackDevMiddeware : config => {
        config.watchOptions.poll = 300;
        return config;
    }
};