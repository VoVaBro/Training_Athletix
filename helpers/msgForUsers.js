module.exports = function (user) {
    return {
        from: 'harrison2@ethereal.email',
        to: user.email,
        subject: 'Привет, новый атлет!',
        html:`
    <h1> ${user.name}, мы рады, что Вы присоеденились к Traning Athletix</h1>
    <p>Ключ активации: ${user.secretKey} </p>
    <p>Для активации аккаунта, просим пройти Вас по ссылке ниже: </p>
    <hr/>
    <p>Проигнорируйте это сообщение, если не регистрировались на Traning Athletix </p>           
`
    }
};