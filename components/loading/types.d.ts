interface LoadingProps{
    type?:'loading'|'error'|'success'|'none',
    title?:string
}

interface LoadingMaskProps{
    mask?:boolean,
}

type PageLoadingProps = LoadingMaskProps & LoadingProps
