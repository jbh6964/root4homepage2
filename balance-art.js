// Original financial interface study. All amounts below are illustrative.
export const balanceData = {
 total:12480000,
 assets:[
  {name:'현금·예금',amount:6240000,share:50,color:'#5626a5'},
  {name:'적금',amount:3744000,share:30,color:'#a385dc'},
  {name:'투자',amount:2496000,share:20,color:'#d9caef'}
 ],
 months:[9200000,10400000,10000000,11700000,12000000,12480000],
 transactions:[['정기 급여','09.24 · 입금','+3,200,000'],['생활비 계좌','09.23 · 이체','−450,000'],['모닝 커피','09.23 · 카드','−4,500']]
};
export const won=value=>Math.round(value).toLocaleString('ko-KR');
