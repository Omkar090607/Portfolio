export const BASE_PATH = process.env.NODE_ENV === 'production' ? '/Portfolio' : ''

export function withBasePath(path) {
	return `${BASE_PATH}${path.startsWith('/') ? path : `/${path}`}`
}

export const SITE_URL = 'https://omkar090607.github.io/Portfolio'
