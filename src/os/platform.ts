

import * as os from 'os';
export function getOSCharSeperator(){
	const platform = os.platform();		
	// switch(platform){
	// 	case 'aix':
	// 	case 'android':
	// 	case 'cygwin':
	// 	case 'darwin':
	// 	case 'freebsd':
	// 	case 'haiku':
	// 	case 'linux':
	// 	case 'netbsd':
	// 	case 'openbsd':
	// 	case 'sunos':

	// 		break;
	// 	case 'win32':

	// }
	return platform === 'win32' ? '\\' : '/';
	//return '/';
}

export function isWindows(){
	return os.platform() === 'win32';
}
