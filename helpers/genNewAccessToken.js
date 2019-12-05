exports.genNewAccessToken = async () => {
    try {
        const token = await fetch('/refreshToken');
        return token
    }catch (e) {
        if (e) throw e
    }
};