function debounce (fn, delayed) {
    let timer = null
    console.log('防抖开启')
    return function () {
        let context = this
        let args = arguments
        clearTimeout(timer)
        timer = setTimeout(()=>{
            fn.apply(context,args)
        },delayed)
    }
}

function throttling(fun,delayed=500) {
    console.log('优化节流开启')
    // 使用闭包，让每次调用时点击定时器状态不丢失
    let timeout=null;
    // 记录第一次点击时的时间戳
    let start = +new Date();
    return function () {
        clearTimeout(timeout);
        let context=this;
        let args=arguments;
        // 记录第一次以后的每次点击的时间戳
        let end=+new Date();
        // 当时间到达设置的延时时间则立即调用数据处理函数
        if(end-start >= delayed){
            fun.apply(context,args);
            // 执行处理函数后，将结束时间设置为开始时间，重新开始记时
            start=end;
            // 后续点击没有到达设置的延时，定时器设定延时进行调用
         }//else{
        //     timeout=setTimeout(function () {
        //         fun.apply(context,args);
        //     },delayed)
        // }
    }
}

export default throttling