import { BRASM_PUBLIC_ENDPOINT } from '../constants/auth.constants';

export function Public() {
  return (
    target: any,
    _?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>,
  ) => {
    if (descriptor) {
      Reflect.defineMetadata(BRASM_PUBLIC_ENDPOINT, true, descriptor.value);
      return descriptor;
    }
    Reflect.defineMetadata(BRASM_PUBLIC_ENDPOINT, true, target);
    return target;
  };
}
