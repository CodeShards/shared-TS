import axios from 'axios'
import {sig} from '@/utils/index'

export default async function isUp (url: string): Promise<boolean> {
	
	return axios.get(url)
		.then(() => true)
		.catch(err => {
			
			if (err.code === 'ECONNREFUSED') return false
			
			sig.warn(err.message)
			return true
			
		})
	
}

