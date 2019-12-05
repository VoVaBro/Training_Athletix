module.exports = function (user) {
    return {
        from: 'hattie.wolf67@ethereal.email',
        to: user.email,
        subject: 'Привет, новый атлет!',
        html:`
    <h1> ${user.name}, мы рады, что Вы присоеденились к Traning Athletix</h1>
    <p>Ключ активации: ${user.secretKey} </p>
    <p>Для активации аккаунта, просим пройти Вас по ссылке ниже: </p>
    <hr/>
    <a href=${process.env.BASE_URL}/signin/${user.secret}>Подтвердить email</a>   
    <hr/>
    <p>Проигнорируйте это сообщение, если не регистрировались на Traning Athletix </p>           
`
    }
};