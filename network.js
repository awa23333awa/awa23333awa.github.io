// 基础代数
const max=Math.max;

// 线性代数
function makeMatrix(rows,cols,arr){
    let res=[];
    for(let i=0;i<rows;++i){
        let row=[];
        for(let j=0;j<cols;++j){
            row.push(arr[i*cols+j]);
        }
        res.push(row);
    }
    return res;
}
function makeZeroMatrix(rows,cols){
    let res=[];
    for(let i=0;i<rows;++i){
        let row=[];
        for(let j=0;j<cols;++j){
            row.push(0);
        }
        res.push(row);
    }
    return res;
}
function matRows(A){
    return A.length;
}
function matCols(A){
    return A[0].length;
}
function matAdd(A,B){
    if(matRows(A)!=matRows(B)||matCols(A)!=matCols(B)){
        throw "Matrixes has diffrent sizes";
    }
    let m=matRows(A),n=matCols(A);
    let C=makeZeroMatrix(m,n);
    for(let i=0;i<m;++i){
        for(let j=0;j<n;++j){
            C[i][j]=A[i][j]+B[i][j];
        }
    }
    return C;
}
function matNeg(A){
    let m=matRows(A),n=matCols(A);
    let B=makeZeroMatrix(m,n);
    for(let i=0;i<m;++i){
        for(let j=0;j<n;++j){
            B[i][j]=-A[i][j];
        }
    }
    return B;
}
function matMul(A,B){
    if(matCols(A)!=matRows(B)){
        throw "Matrices are incompatible";
    }
    let m=matRows(A),n=matCols(A),p=matCols(B);
    let C=makeZeroMatrix(m,p);
    for(let i=0;i<m;++i){
        for(let j=0;j<p;++j){
            for(let k=0;k<n;++k){
                C[i][j]+=A[i][k]*B[k][j];
            }
        }
    }
    return C;
}
function matGen(A,f){
    let m=matRows(A),n=matCols(A);
    let B=makeZeroMatrix(m,n);
    for(let i=0;i<m;++i){
        for(let j=0;j<n;++j){
            B[i][j]=f(A[i][j]);
        }
    }
    return B;
}
function matVec(x){
    return makeMatrix(x.length,1,x);
}

// 神经网络
const Relu=(x)=>{return max(0,x);};
const exp=Math.exp;
function softmax(x){
    let maxv=x[0];
    for(let y of x){
        maxv=max(maxv,y);
    }
    let r=[];
    let expsum=0;
    for(let y of x){
        let z=exp(y-maxv);
        expsum+=z;
        r.push(z);
    }
    for(let y in r){
        r[y]/=expsum;
    }
    return r;
}

// 模型
const Net=initNetwork();
function predict(x){
    let a=matAdd(matMul(Net.FC0W,x),Net.FC0B);
    let b=matGen(a,Relu);
    let c=matAdd(matMul(Net.FC1W,b),Net.FC1B);
    let d=matGen(c,Relu);
    let e=matAdd(matMul(Net.FC2W,d),Net.FC2B);
    let f=[];
    for(let y of e){
        f.push(y[0]);
    }
    let y=softmax(f);
    return y;
}