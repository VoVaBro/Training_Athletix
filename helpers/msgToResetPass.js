module.exports = function (user) {
    return {
        from: 'elliot.shields@ethereal.email',
        to: user.email,
        subject: 'Привет, новый атлет!',
        html:`
    <h1> Для восстановления пароля пройдите по ссылке, указанной ниже:</h1>
    <p>Ключ активации: ${user.secretKey} </p>
    <p>Пройдите по ссылке: <a href="http://localhost:3000/resetPass/${user.secret}">reset</a></p>
              
`
    }
};