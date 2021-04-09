function  getFullDate(date){
        var s_date = new Date(date);
        var s_month = (parseInt(s_date.getMonth()) + parseInt(1)) <= 9 ? ('0' + (parseInt(s_date.getMonth()) + parseInt(1)) ) : (parseInt(s_date.getMonth()) + parseInt(1)) ;
        var s_day =  s_date.getDate() <=9 ? '0'+ s_date.getDate() :  s_date.getDate();
        var s_hour = s_date.getHours() <=9 ? '0'+ s_date.getHours() :  s_date.getHours();
        var s_min = s_date.getMinutes() <=9 ? '0'+ s_date.getMinutes() :  s_date.getMinutes();
        var s_sec = s_date.getSeconds() <=9 ? '0'+ s_date.getSeconds() :  s_date.getSeconds();

        var final_date = s_date.getFullYear() +'-' + s_month +'-'+ s_day;
        return {
            datetime: s_date.getFullYear() +'-' + s_month +'-'+ s_day +'T'+s_hour+':'+s_min+':'+s_sec,
            date:final_date
        };

 }
