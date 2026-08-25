import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
	/* config options here */
}

module.exports = {
	turbopack: {
		root: path.join(__dirname, '../../'),
	},
}

export default nextConfig
