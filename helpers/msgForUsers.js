module.exports = function (user) {
    return {
        from: 'elliot.shields@ethereal.email',
        to: user.email,
        subject: 'Привет, новый атлет!',
        html:`
    <h1> ${user.name}, мы рады, что Вы присоеденились к Traning Athletix</h1>
    <p>Для активации аккаунта, просим пройти Вас по ссылке ниже: </p>
    <hr/>
    <a href="http://localhost:3000/verifyEmail/${user.secretKey}/${user.secret}">Active account</a>
    
    <p>Проигнорируйте это сообщение, если не регистрировались на Traning Athletix </p>           
`
    }
};