export default function PolicyImg({policy,index=0,className=null}){
    if(!policy?.pimages?.length){
        return ' ';
    }
    return(
        <div>
            <img className={className} src={'http://localhost:4000/uploads/'+policy?.pimages[index]} alt="pimage"/>
        </div>
    )
}