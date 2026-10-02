// ESHCC academic calendar 2026-2027 data + date helpers.
// Helpers use LOCAL dates (the old toISOString() approach shifted every day back by one in CET, which pushed Monday labels onto Tuesday).
(function(){
const ESHCC_DATA = [
            // Term 1
            { cw: "35", term: "Term 1", termWk: "Intro Week", start: "2026-08-24", end: "2026-08-30", activity: "Introduction new students", type: "special" },
            { cw: "36", term: "Term 1", termWk: "Term 1, Wk 1", start: "2026-08-31", end: "2026-09-04", activity: "Lectures", type: "lecture" },
            { cw: "37", term: "Term 1", termWk: "Term 1, Wk 2", start: "2026-09-07", end: "2026-09-11", activity: "Lectures", type: "lecture" },
            { cw: "38", term: "Term 1", termWk: "Term 1, Wk 3", start: "2026-09-14", end: "2026-09-18", activity: "Lectures", type: "lecture" },
            { cw: "39", term: "Term 1", termWk: "Term 1, Wk 4", start: "2026-09-21", end: "2026-09-25", activity: "Lectures", type: "lecture" },
            { cw: "40", term: "Term 1", termWk: "Term 1, Wk 5", start: "2026-09-28", end: "2026-10-02", activity: "Lectures", type: "lecture" },
            { cw: "41", term: "Term 1", termWk: "Term 1, Wk 6", start: "2026-10-05", end: "2026-10-09", activity: "Lectures", type: "lecture" },
            { cw: "42", term: "Term 1", termWk: "Term 1, Wk 7", start: "2026-10-12", end: "2026-10-16", activity: "Lectures", type: "lecture" },
            { cw: "43", term: "Term 1", termWk: "Term 1, Wk 8", start: "2026-10-19", end: "2026-10-23", activity: "Lectures", type: "lecture" },
            { cw: "44", term: "Term 1", termWk: "Term 1, Wk 9", start: "2026-10-26", end: "2026-10-30", activity: "Teaching-free week / self-study", type: "teaching-free" },
            { cw: "45", term: "Term 1", termWk: "Term 1, Wk 10", start: "2026-11-02", end: "2026-11-06", activity: "Assessment and evaluation week", type: "assessment" },

            // Term 2
            { cw: "46", term: "Term 2", termWk: "Term 2, Wk 1", start: "2026-11-09", end: "2026-11-13", activity: "Lectures", type: "lecture" },
            { cw: "47", term: "Term 2", termWk: "Term 2, Wk 2", start: "2026-11-16", end: "2026-11-20", activity: "Lectures", type: "lecture" },
            { cw: "48", term: "Term 2", termWk: "Term 2, Wk 3", start: "2026-11-23", end: "2026-11-27", activity: "Lectures", type: "lecture" },
            { cw: "49", term: "Term 2", termWk: "Term 2, Wk 4", start: "2026-11-30", end: "2026-12-04", activity: "Lectures", type: "lecture" },
            { cw: "50", term: "Term 2", termWk: "Term 2, Wk 5", start: "2026-12-07", end: "2026-12-11", activity: "Lectures", type: "lecture" },
            { cw: "51", term: "Term 2", termWk: "Term 2, Wk 6", start: "2026-12-14", end: "2026-12-18", activity: "Teaching-free week / self-study", type: "teaching-free" },
            { cw: "52", term: "Term 2", termWk: "Winter Recess", start: "2026-12-21", end: "2026-12-25", activity: "Winter recess", type: "recess" },
            { cw: "53", term: "Term 2", termWk: "Winter Recess", start: "2026-12-28", end: "2027-01-01", activity: "Winter recess", type: "recess" },
            { cw: "01", term: "Term 2", termWk: "Term 2, Wk 7", start: "2027-01-04", end: "2027-01-08", activity: "Lectures", type: "lecture" },
            { cw: "02", term: "Term 2", termWk: "Term 2, Wk 8", start: "2027-01-11", end: "2027-01-15", activity: "Lectures", type: "lecture" },
            { cw: "03", term: "Term 2", termWk: "Term 2, Wk 9", start: "2027-01-18", end: "2027-01-22", activity: "Lectures", type: "lecture" },
            { cw: "04", term: "Term 2", termWk: "Term 2, Wk 10", start: "2027-01-25", end: "2027-01-29", activity: "Assessment and evaluation week", type: "assessment" },

            // Term 3
            { cw: "05", term: "Term 3", termWk: "Term 3, Wk 1", start: "2027-02-01", end: "2027-02-05", activity: "Lectures", type: "lecture" },
            { cw: "06", term: "Term 3", termWk: "Term 3, Wk 2", start: "2027-02-08", end: "2027-02-12", activity: "Lectures", type: "lecture" },
            { cw: "07", term: "Term 3", termWk: "Term 3, Wk 3", start: "2027-02-15", end: "2027-02-19", activity: "Lectures", type: "lecture" },
            { cw: "08", term: "Term 3", termWk: "Term 3, Wk 4", start: "2027-02-22", end: "2027-02-26", activity: "Lectures", type: "lecture" },
            { cw: "09", term: "Term 3", termWk: "Term 3, Wk 5", start: "2027-03-01", end: "2027-03-05", activity: "Lectures", type: "lecture" },
            { cw: "10", term: "Term 3", termWk: "Term 3, Wk 6", start: "2027-03-08", end: "2027-03-12", activity: "Lectures", type: "lecture" },
            { cw: "11", term: "Term 3", termWk: "Term 3, Wk 7", start: "2027-03-15", end: "2027-03-19", activity: "Lectures", type: "lecture" },
            { cw: "12", term: "Term 3", termWk: "Term 3, Wk 8", start: "2027-03-22", end: "2027-03-26", activity: "Lectures", notes: "No class Friday (Good Friday)", type: "lecture" },
            { cw: "13", term: "Term 3", termWk: "Term 3, Wk 9", start: "2027-03-29", end: "2027-04-02", activity: "Teaching-free week / self-study", notes: "Easter Monday", type: "teaching-free" },
            { cw: "14", term: "Term 3", termWk: "Term 3, Wk 10", start: "2027-04-05", end: "2027-04-09", activity: "Assessment and evaluation week (+ resits for exchange)", type: "assessment" },

            // Term 4
            { cw: "15", term: "Term 4", termWk: "Term 4, Wk 1", start: "2027-04-12", end: "2027-04-16", activity: "Lectures", type: "lecture" },
            { cw: "16", term: "Term 4", termWk: "Term 4, Wk 2", start: "2027-04-19", end: "2027-04-23", activity: "Lectures", type: "lecture" },
            { cw: "17", term: "Term 4", termWk: "Term 4, Wk 3", start: "2027-04-26", end: "2027-04-30", activity: "Lectures", notes: "No class Tuesday (Kings Day)", type: "lecture" },
            { cw: "18", term: "Term 4", termWk: "Term 4, Wk 4", start: "2027-05-03", end: "2027-05-07", activity: "Lectures", notes: "No class Wednesday (Liberation Day), no class Thursday (Ascension Day)", type: "lecture" },
            { cw: "19", term: "Term 4", termWk: "Term 4, Wk 5", start: "2027-05-10", end: "2027-05-14", activity: "Lectures", type: "lecture" },
            { cw: "20", term: "Term 4", termWk: "Term 4, Wk 6", start: "2027-05-17", end: "2027-05-21", activity: "Lectures", notes: "No class Monday (Whit Monday)", type: "lecture" },
            { cw: "21", term: "Term 4", termWk: "Term 4, Wk 7", start: "2027-05-24", end: "2027-05-28", activity: "Lectures", type: "lecture" },
            { cw: "22", term: "Term 4", termWk: "Term 4, Wk 8", start: "2027-05-31", end: "2027-06-04", activity: "Lectures", type: "lecture" },
            { cw: "23", term: "Term 4", termWk: "Term 4, Wk 9", start: "2027-06-07", end: "2027-06-11", activity: "Lectures", type: "lecture" },
            { cw: "24", term: "Term 4", termWk: "Term 4, Wk 10", start: "2027-06-14", end: "2027-06-18", activity: "Teaching-free week / self-study", type: "teaching-free" },
            { cw: "25", term: "Term 4", termWk: "Term 4, Wk 11", start: "2027-06-21", end: "2027-06-25", activity: "Assessment and evaluation week", type: "assessment" },

            // Resit Period
            { cw: "26", term: "Resit", termWk: "Resit Wk 1", start: "2027-06-28", end: "2027-07-02", activity: "Resit BA1 (priority) and BA2/3", type: "assessment" },
            { cw: "27", term: "Resit", termWk: "Resit Wk 2", start: "2027-07-05", end: "2027-07-09", activity: "Resit minors + resit BA2/3 + BA1 term 4", type: "assessment" },
            { cw: "28", term: "Resit", termWk: "Grading Wk", start: "2027-07-12", end: "2027-07-16", activity: "Teaching-free week / grading", type: "teaching-free" },

            // Summer Recess
            { cw: "29", term: "Summer", termWk: "Recess Wk 1", start: "2027-07-19", end: "2027-07-23", activity: "Summer recess", type: "recess" },
            { cw: "30", term: "Summer", termWk: "Recess Wk 2", start: "2027-07-26", end: "2027-07-30", activity: "Summer recess", type: "recess" },
            { cw: "31", term: "Summer", termWk: "Recess Wk 3", start: "2027-08-02", end: "2027-08-06", activity: "Summer recess", type: "recess" },
            { cw: "32", term: "Summer", termWk: "Recess Wk 4", start: "2027-08-09", end: "2027-08-13", activity: "Summer recess", type: "recess" },

            // Preview 2027-2028
            { cw: "33", term: "2027-28", termWk: "Eurekaweek", start: "2027-08-16", end: "2027-08-20", activity: "Eurekaweek 2027", type: "special" },
            { cw: "34", term: "2027-28", termWk: "Intro Week", start: "2027-08-23", end: "2027-08-29", activity: "Introduction new students", type: "special" },
            { cw: "35", term: "2027-28", termWk: "Term 1, Wk 1", start: "2027-08-30", end: "2027-09-03", activity: "Start academic year 2027-2028", type: "special" },
        ];

        // SPECIAL HOLIDAYS & NO-CLASS DATES
        const SPECIFIC_HOLIDAYS = [
            { date: "2026-08-17", end: "2026-08-23", name: "Eurekaweek 2026", desc: "Orientation Week", type: "special" },
            { date: "2026-08-24", end: "2026-08-30", name: "Introduction Week", desc: "Student associations + new students", type: "special" },
            { date: "2026-08-31", name: "Start Academic Year", desc: "Official opening of 2026-2027", type: "special" },
            { date: "2026-12-21", end: "2027-01-03", name: "Winter Holiday", desc: "University Closure", type: "recess" },
            { date: "2027-03-26", name: "Good Friday", desc: "No class Friday", type: "holiday" },
            { date: "2027-03-29", name: "Easter Monday", desc: "Public Holiday", type: "holiday" },
            { date: "2027-04-27", name: "Kings Day", desc: "No class Tuesday", type: "holiday" },
            { date: "2027-05-05", name: "Liberation Day", desc: "No class Wednesday", type: "holiday" },
            { date: "2027-05-06", name: "Ascension Day", desc: "No class Thursday", type: "holiday" },
            { date: "2027-05-17", name: "Whit Monday", desc: "No class Monday", type: "holiday" },
            { date: "2027-07-19", end: "2027-08-15", name: "Summer Recess", desc: "Education Free Period", type: "recess" },
            { date: "2027-08-16", end: "2027-08-20", name: "Eurekaweek 2027", desc: "Orientation Week 2027", type: "special" },
            { date: "2027-08-30", name: "Start AY 2027–2028", desc: "Official start next academic year", type: "special" }
        ];

        
const pad=n=>String(n).padStart(2,'0');
const iso=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const weekFor=s=>ESHCC_DATA.find(w=>s>=w.start&&s<=w.end);
const holFor=s=>SPECIFIC_HOLIDAYS.find(h=>h.end?(s>=h.date&&s<=h.end):h.date===s);
const TYPES={
 lecture:{label:'Lectures',c:'#D5E1DD',fg:'#0E2A28',dot:'#8FAFA7'},
 assessment:{label:'Assessment',c:'#D0612F',fg:'#FFFFFF',dot:'#D0612F'},
 'teaching-free':{label:'Teaching-free',c:'#1F8F7A',fg:'#FFFFFF',dot:'#1F8F7A'},
 recess:{label:'Recess',c:'#B7BBB4',fg:'#1D2321',dot:'#9DA29A'},
 holiday:{label:'Public holiday',c:'#C2364B',fg:'#FFFFFF',dot:'#C2364B'},
 special:{label:'Special dates',c:'#4F5BC4',fg:'#FFFFFF',dot:'#4F5BC4'}
};
function dayInfo(s){const w=weekFor(s)||null,h=holFor(s)||null;const d=new Date(s+'T00:00:00');const dow=(d.getDay()+6)%7;
 let type=null;if(h)type=h.type;else if(w&&s<=w.end)type=w.type;return {iso:s,week:w,holiday:h,type,dow,weekend:dow>4};}
function monthRows(y,m){const first=new Date(y,m,1);const start=new Date(y,m,1-((first.getDay()+6)%7));const rows=[];let cur=new Date(start);
 while(true){const days=[];for(let i=0;i<7;i++){const s=iso(cur);const info=dayInfo(s);info.num=cur.getDate();info.inMonth=cur.getMonth()===m;days.push(info);cur.setDate(cur.getDate()+1);}
  rows.push({week:weekFor(days[0].iso)||null,days});if(cur.getMonth()!==m||cur.getFullYear()!==y)if(new Date(cur)>new Date(y,m+1,0))break;}
 return rows;}
const MONTHS=[];for(let i=0;i<13;i++){const d=new Date(2026,7+i,1);MONTHS.push({y:d.getFullYear(),m:d.getMonth(),key:d.getFullYear()+'-'+pad(d.getMonth()+1),name:d.toLocaleDateString('en-GB',{month:'long'}),short:d.toLocaleDateString('en-GB',{month:'short'})});}
const fmt=(s,o)=>new Date(s+'T00:00:00').toLocaleDateString('en-GB',o||{day:'numeric',month:'short'});
const TERMS=[{id:'Term 1',title:'Term 1',sub:'Autumn 2026'},{id:'Term 2',title:'Term 2',sub:'Winter 2026–27'},{id:'Term 3',title:'Term 3',sub:'Spring 2027'},{id:'Term 4',title:'Term 4',sub:'Early summer 2027'},{id:'Resit',title:'Resits',sub:'Summer 2027'},{id:'Summer',title:'Summer recess',sub:'Education-free'},{id:'2027-28',title:'2027–28',sub:'Preview'}];
window.ESHCC={WEEKS:ESHCC_DATA,HOLIDAYS:SPECIFIC_HOLIDAYS,TYPES,TERMS,MONTHS,iso,weekFor,holFor,dayInfo,monthRows,fmt,
 loadNotes:()=>{try{return JSON.parse(localStorage.getItem('ESHCC_CALENDAR_NOTES')||'{}')}catch(e){return {}}},
 saveNotes:n=>localStorage.setItem('ESHCC_CALENDAR_NOTES',JSON.stringify(n))};
})();
