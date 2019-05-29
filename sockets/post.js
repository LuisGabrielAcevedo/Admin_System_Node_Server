module.exports = function(io) {
    io.on('connection', socket => {
        socket.on('refresh_posts', (data) => {
            console.log(data);
        })
    })
}