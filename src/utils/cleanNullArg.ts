//Null이 아닌 받은 인자를 정리해서 Object로 넣기 
const cleanNullArgs = (args: object): object => {
    const notNull = {};
    Object.keys(args).forEach(key => {
      if (args[key] !== null) {
        notNull[key] = args[key];
      }
    });
    return notNull;
  };
  
  export default cleanNullArgs;