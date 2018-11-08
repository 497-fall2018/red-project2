export function sort(foods){
    var len=foods.length,j;
    var temp;
    for(j=0;j<len-1;j++)
    while(len>1){
      for(j=0;j<len-1;j++){
        if(parseInt(foods[j].rank)<parseInt(foods[j+1].rank)){
            temp=foods[j];
            foods[j]=foods[j+1];
            foods[j+1]=temp;
        }
      }
      len--;
    }
    return foods;
}