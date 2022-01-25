import React from 'react';
import { IconClose, IconExpand, IconMinus } from '@arco-design/web-react/icon'
import styles from './style/handler.module.less';

function Handler() {
  return (
    <div className={styles['handler-area']}>
      <IconMinus onClick={() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.ipcRenderer.send('minimize')
      }} />
      <IconExpand onClick={() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.ipcRenderer.send('maximize')
      }}/>
      <IconClose onClick={() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.ipcRenderer.send('quit')
      }}/>
    </div>
  )
}

export default Handler;
