export function getEpTime(ee:number):string{
    const e = Math.round(ee);
    let h = Math.floor(e / 3600).toString();
    let m:string =""
    let s = (e % 60).toString();
    const ar: string[] = [];

    if (h === "0") {
        s = s.length === 1 ? (s = `0${s}`) : s;
        m = Math.floor((e % 3600) / 60).toString();
        m = m.length === 1 ? `0${m}` : m;
        ar.push(m, s);
    } else {
        s= s.length === 1 ? (s = `0${s}`) : s;
        m = Math.floor((e % 3600) / 60).toString();
        m = m.length === 1 ? `0${m}` : m;
        h= h.length === 1 ? (h = `0${h}`) : h;
        ar.push(h, m, s);
    }
    return ar.join(":");
}
export function trim(string:string,maxLength:number = 120):string{
    let t = string.substring(0, maxLength - 3);
    t = t.substring(0,Math.min(t.length,t.lastIndexOf(" ")))+"..."
    return t
}
export function formatNewLines(text: string): string {
    const fixedText = text.replace(/\\n\\n/g, '\n');
    return fixedText.replace(/\n/g, '<br />');
}