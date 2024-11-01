export const ErrorTip = (props: { msg: string }) => {
  return <>
    <div style={{
      textAlign: 'left',
      wordWrap: 'break-word',
      width: '80vw',
    }}>
      <span>
        {props.msg}
      </span>
    </div>
  </>
}
