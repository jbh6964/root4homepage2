// Original financial interface study. All amounts below are illustrative.
export const balanceData = {
 total:12480000,
 assets:[
  {name:'현금·예금',amount:6240000,share:50,color:'#5626a5'},
  {name:'적금',amount:3744000,share:30,color:'#a385dc'},
  {name:'투자',amount:2496000,share:20,color:'#d9caef'}
 ],
 flow:[9200000,10400000,10000000,11700000,12000000,12480000],
 flowLabels:['기본','유입','소비','저축','투자','현재'],
 transactions:[['급여 계좌','입금','+3,200,000'],['생활비 계좌','이체','−450,000'],['카페 이용','카드','−4,500']]
};
export const won=value=>Math.round(value).toLocaleString('ko-KR');
