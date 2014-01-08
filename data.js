
var start = 1984.0;
var end = 2014.0;

var typeData = {
  "city": {"intro": "He lived in", "img": "img/city.png"}
  , "school": {"intro": "He attended school at", "img": "img/school.png" }
  , "job": {"intro": "He worked for", "img": "img/job.png" }
  , "pet": {"intro": "His pets were", "single": "His pet was", "img": "img/pet.png" }
  , "hobby": {"intro": "His hobbies were", "single": "His hobby was", "img": "img/hobby.png" }
  , "computer": {"intro": "His computers were", "single": "His computer was", "article": "a", "img": "img/computer.png" }
  , "programming" : {"intro": "He programmed in", "img": "img/code.png" }
  , "car": {"intro": "He drove", "article": "a", "img": "img/car.png" }
  , "diet": {"intro": "His diet was", "img": "img/diet.png" }
  , "exercise": {"intro": "His regular exercise was", "img": "img/exercise.png" }
};

var eventData = [
  { "type": "job", "name": "The Daily Tribune", "start": 1995.25, "end": 1998.25 }
  , { "type": "job", "name": "Royal Oak School District", "start": 2000.5, "end": 2002.5}
  , { "type": "job", "name": "MIT Cognation Research Group", "start": 2002.75, "end": 2003.25 }
  , { "type": "job", "name": "MIT 1.00", "start": 2003.0, "end": 2004.0 }
  , { "type": "job", "name": "MIT Housing", "start": 2003.0, "end": 2006.5 }
  , { "type": "job", "name": "MIT Tangible Media Group", "start": 2003.5, "end": 2003.75 }
  , { "type": "job", "name": "MIT IS&T", "start": 2003.75, "end": 2006.5 }
  , { "type": "job", "name": "MIT Quanta Research Group", "start": 2004.5, "end": 2004.75 }
  , { "type": "job", "name": "MATCH Charter High School", "start": 2004.5, "end": 2004.75 }
  , { "type": "job", "name": "MIT CERN CMS Group", "start": 2005.5, "end": 2005.75 }
  , { "type": "job", "name": "Apple", "start": 2006.5, "end": 2006.75 }
  , { "type": "job", "name": "Freelance", "narrative": "himself", "start": 2006.75, "end": 2007.67 }
  , { "type": "job", "name": "Gayle's Chocolates", "start": 2007.25, "end": 2007.5 }
  , { "type": "job", "name": "Zimride", "start": 2007.67, "end": 2008.33 }
  , { "type": "job", "name": "Freelance", "narrative": "himself", "start": 2008.67, "end": 2011.25 }
  , { "type": "job", "name": "Doner Advertising", "start": 2010.0, "end": 2011.25 }
  , { "type": "job", "name": "Freelance", "narrative": "himself", "start": 2011.75, "end": 2012.75 }
  , { "type": "job", "name": "Chatango", "start": 2012.0, "end": 2012.75 }
  , { "type": "job", "name": "The MIT Center for Civic Media", "start": 2012.75, "end": 2014 }
  , { "type": "pet", "name": "Bruiser the dog", "start": 1984.0, "end": 1992.5 }
  , { "type": "pet", "name": "Cotton the cat", "start": 1991.5, "end": 2011.0 }
  , { "type": "pet", "name": "Mo the dog", "start": 2009.0, "end": 2011.5 }
  , { "type": "pet", "name": "Lemon the cat", "start": 2012.0, "end": 2014.0 }
  , { "type": "city", "name": "Royal Oak, MI", "start": 1984, "end": 2002.75 }
  , { "type": "city", "name": "Cambridge, MA", "start": 2002.75, "end": 2005.5 }
  , { "type": "city", "name": "Meyrin, Switzerland", "start": 2005.5, "end": 2005.75 }
  , { "type": "city", "name": "Cambridge, MA", "start": 2005.75, "end": 2006.5 }
  , { "type": "city", "name": "Cupertino, CA", "start": 2006.5, "end": 2006.75 }
  , { "type": "city", "name": "Deroit, MI", "start": 2006.75, "end": 2007.66 }
  , { "type": "city", "name": "Waterloo, ON", "start": 2007.66, "end": 2009.0 }
  , { "type": "city", "name": "Ferndale, MI", "start": 2009.0, "end": 2012.75 }
  , { "type": "city", "name": "Somerville, MA", "start": 2012.75, "end": 2014.0 }
  , { "type": "computer", "name": "Apple IIe", "start": 1994.25, "end": 1996.75 }
  , { "type": "computer", "name": "Pentium 133MHz", "start": 1996.75, "end": 2002.75 }
  , { "type": "computer", "name": "Athlon 1GHz", "start": 2000.0, "end": 2002.75 }
  , { "type": "computer", "name": "Thinkpad 486", "start": 2001.5, "end": 2002.75 }
  , { "type": "computer", "name": "Compaq 1GHz Laptop", "start": 2002.75, "end": 2006.75 }
  , { "type": "computer", "name": "Macbook", "start": 2006.75, "end": 2011.75 }
  , { "type": "computer", "name": "Macbook Air", "start": 2011.75, "end": 2014.0 }
  , { "type": "programming", "name": "BASIC", "start": 1994.25, "end": 2001.75 }
  , { "type": "programming", "name": "HTML", "start": 1996, "end": 2014 }
  , { "type": "programming", "name": "Java", "start": 1997, "end": 2006 }
  , { "type": "programming", "name": "Java", "start": 2013.5, "end": 2014 }
  , { "type": "programming", "name": "C", "start": 1997.75, "end": 2006.5 }
  , { "type": "programming", "name": "Visual Basic", "start": 1998, "end": 1999.5 }
  , { "type": "programming", "name": "C++", "start": 1999.75, "end": 2005.75 }
  , { "type": "programming", "name": "x86 Assembly", "start": 2000.25, "end": 2000.5 }
  , { "type": "programming", "name": "PERL", "start": 2001.75, "end": 2006.75 }
  , { "type": "programming", "name": "MATLAB", "start": 2002.75, "end": 2014 }
  , { "type": "programming", "name": "Scheme", "start": 2003.0, "end": 2006.5 }
  , { "type": "programming", "name": "CSS", "start": 2005.0, "end": 2014 }
  , { "type": "programming", "name": "Objective C", "start": 2006.5, "end": 2006.75 }
  , { "type": "programming", "name": "PHP", "start": 2006.75, "end": 2014 }
  , { "type": "programming", "name": "JavaScript", "start": 2006.75, "end": 2014 }
  , { "type": "programming", "name": "Python", "start": 2012.5, "end": 2014 }
  , { "type": "programming", "name": "Ruby", "start": 2013, "end": 2014 }
  , { "type": "car", "name": "Ford Tempo", "start": 2001.5, "end": 2002.5 }
  , { "type": "car", "name": "Saturn SL2", "start": 2010, "end": 2011.25 }
  , { "type": "car", "name": "Honda Civic", "start": 2011.5, "end": 2012.75 }
  , { "type": "hobby", "name": "karate", "start": 1992, "end": 1994 }
  , { "type": "hobby", "name": "trumpet", "start": 1994.75, "end": 1998.75 }
  , { "type": "hobby", "name": "jazz band", "start": 1997.75, "end": 1998.5 }
  , { "type": "hobby", "name": "baseball", "start": 1999.25, "end": 1999.5 }
  , { "type": "hobby", "name": "art club", "start": 1996.75, "end": 2000.5 }
  , { "type": "hobby", "name": "photo club", "start": 1999.75, "end": 2002.5 }
  , { "type": "hobby", "name": "programming team", "start": 1999.75, "end": 2002.5 }
  , { "type": "hobby", "name": "The Tech", "start": 2002.75, "end": "2006.5" }
  , { "type": "hobby", "name": "WMBR", "start": 2003.5, "end": "2006.5" }
  , { "type": "hobby", "name": "Wing Chun kung fu", "start": 2006.75, "end": "2007.75" }
  , { "type": "hobby", "name": "Wikipedia", "start": 2006.75, "end": "2009.25" }
  , { "type": "hobby", "name": "swing and blues dancing", "start": 2008.0, "end": 2014.0 }
  , { "type": "hobby", "name": "PenFlakes", "start": 2011.25, "end": 2012.25 }
  , { "type": "hobby", "name": "i3 Detroit", "start": 2009.25, "end": 2014 }
  , { "type": "diet", "name": "vegetarian", "start": 1994.75, "end": 2014.0 }
  , { "type": "diet", "name": "caffeine-free", "start": 2007.5, "end": 2014.0 }
  , { "type": "diet", "name": "alcohol-free", "start": 1984.0, "end": 2014.0 }
  , { "type": "school", "name": "Whittier Elementary", "start": 1988.75, "end": 1996.5 }
  , { "type": "school", "name": "Helen Keller Junior High School", "start": 1996.75, "end": 1998.5 }
  , { "type": "school", "name": "George A. Dondero High School", "start": 1998.75, "end": 2002.5 }
  , { "type": "school", "name": "MIT", "start": 2002.75, "end": 2006.5 }
  , { "type": "school", "name": "The University of Waterloo", "start": 2007.66, "end": 2009.0 }
  , { "type": "exercise", "name": "wight-lifting", "start": 1998.25, "end": 2002.75 }
  , { "type": "exercise", "name": "weight-lifting", "start": 2005.75, "end": 2009.0 }
  , { "type": "exercise", "name": "jogging", "start": 2011.0, "end": 2014.0 }
  , { "type": "exercise", "name": "swimming", "start": 2011.0, "end": 2012.75 }
];