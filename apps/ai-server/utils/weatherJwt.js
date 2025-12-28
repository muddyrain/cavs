const { importPKCS8, SignJWT } = require("jose")

const YourPrivateKey = `-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEIG9JkvfW9h4j1o2O6R/6MjtUeurgVcJuduuTnRJt7aTQ
-----END PRIVATE KEY-----`

/**
 * 生成和风天气API的JWT令牌
 * @param {string} keyId - 你的密钥ID
 * @param {string} projectId - 你的项目ID
 * @returns {Promise<string>} JWT令牌
 */
async function generateWeatherJWT(keyId, projectId) {
	try {
		const privateKey = await importPKCS8(YourPrivateKey, "EdDSA")

		const customHeader = {
			alg: "EdDSA",
			kid: keyId
		}

		const iat = Math.floor(Date.now() / 1000) - 30
		const exp = iat + 900

		const customPayload = {
			sub: projectId,
			iat: iat,
			exp: exp
		}

		const token = await new SignJWT(customPayload).setProtectedHeader(customHeader).sign(privateKey)

		return token
	} catch (error) {
		throw new Error(`生成JWT失败: ${error.message}`)
	}
}

module.exports = {
	generateWeatherJWT
}
