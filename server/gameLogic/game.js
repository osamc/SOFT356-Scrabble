function generatePool() {

    let tilePool = {};

    let poolOptions = createPoolOptions();

    for(let i = 0; i < 26; i++) {
        let letter = (i + 10).toString(36);
        let letterCount = poolOptions[letter + 'Count'];
        let letterValue = poolOptions[letter + 'Value'];
        
        for(let j = 0; j < letterCount; j++) {
          tilePool.push({'letter': letter, value: letterValue});
        }
        
    }

    return tilePool;

}

function createPoolOptions() {
    let poolOptions = {
        aCount = 9,
        aValue = 1,
    
        bCount = 2,
        bValue = 3,
    
        cCount = 2,
        cValue = 3,
    
        dCount = 4,
        dValue = 2,
    
        eCount = 1,
        eValue = 1,
    
        fCount = 2,
        fValue = 4,
    
        gCount = 3,
        gValue = 2,
    
        hCount = 2,
        hValue = 4,
    
        iCount = 9,
        iValue = 1,
    
        jCount = 1,
        jValue = 8,
    
        kCount = 1,
        kValue = 5,
    
        lCount = 4,
        lValue = 1,
    
        mCount = 2,
        mValue = 3,
    
        nCount = 6,
        nValue = 1,
    
        oCount = 8,
        oValue = 1,
    
        pCount = 2,
        pCount = 3,
    
        qCount = 1,
        qValue = 1,
    
        rCount = 6,
        rValue = 1,
    
        sCount = 4,
        sValue = 1,
    
        tCount = 6,
        tValue = 1,
    
        u,ount = 4,
        uValue = 1,
    
        vCount = 2,
        vValue = 4,
    
        wCount = 2,
        wValue = 4,
    
        xCount = 1,
        xValue = 8,
    
        yCount = 2,
        yValue = 4,
    
        zCount = 1,
        zValue = 1
    };

    return poolOptions
}