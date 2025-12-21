function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
}


function mapKeysToCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(mapKeysToCamelCase)
  }


  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc: any, key) => {
      acc[toCamelCase(key)] = mapKeysToCamelCase(obj[key])
      return acc
    }, {} as any)
  }


  return obj
}


export default class BaseModel<T> {
  constructor(data: Record<string, any>) {
    const camelData = mapKeysToCamelCase(data)
    Object.assign(this, camelData)
  }


  // Optional: factory for nested models
  static fromMap<T>(this: new (data: any) => T, data: any): T {
    return new this(data)
  }
}
