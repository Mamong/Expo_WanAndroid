interface EmptyProps{
    isSuccess:boolean,
    isError:boolean,
    emptyTips?:string,
    error?:string,
    cover?:string,
    actionTitle?:string,
    action?:()=>void
}

interface LoadingEmptyProps{
    emptyTips?:string,
    cover?:string,
}

interface ErrorEmptyProps{
    error?:string,
    cover?:string,
    actionTitle?:string,
    action?:()=>void
}