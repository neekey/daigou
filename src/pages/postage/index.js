import React from 'react';
import wechart from './Wechat.jpg';
import style from './index.scss';

export default function Postage() {
  return (<div className={style.container}>
    <h3>邮费与购买说明</h3>
    <ul>
      <li>所有婴幼儿奶粉价格均已包含邮费，3罐为一箱，若不满三罐额外增加邮费</li>
      <li>所有保健品价格均不包含邮费，邮费按照 30人民币/KG 计算。一箱最多包含6件产品</li>
      <li>保健品和婴幼儿奶粉不可混寄</li>
      <li>商品寄出后请第一时间
        <a
          href="http://express.emms.com.au/wap/upload-id?from=singlemessage&isappinstalled=0"
          target="_blank">上传您的身份信息</a>，请确保您的手机号和姓名和所给的邮寄信息一致。</li>
    </ul>
    <div>
      <p>扫码或者加微信 "Neekey", 请注明 "澳洲代购"</p>
      <img src={wechart} alt="neekey" className={style.qrcode} />
    </div>

  </div>);
}
