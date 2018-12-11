import { getPlural } from '@matersoft/mypluralize'
export function sendRequest(): String {
  return "hola mundo" + getPlural('luis')
}

const s = sendRequest()
console.log(s);
