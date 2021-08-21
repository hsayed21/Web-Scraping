## Elzero Scraper
> This script get all content of course page with lesson title and its codes

```python
# pip install beautifulsoup4
from bs4 import BeautifulSoup
import requests

# Course Link
link = "https://elzero.org/category/courses/html-course/"
#lang = "html"

# Get HTML Page Content
res = requests.get(link)
soup = BeautifulSoup(res.text, 'html.parser')
# Find All Divs That Contains Details Each Lesson
lessons = soup.find_all("div","lesson-box co-has-number")

myDict = {}
for lesson in lessons:
    # Get Lesson Number
    num = lesson.find('span').text.strip()
    # Get Lesson Title
    title = lesson.find('h3').text
    # Get Lesson URL
    lessonUrl = lesson.find('a','lesson-name',href=True)['href']
    res = requests.get(lessonUrl)
    soup = BeautifulSoup(res.text, 'html.parser')
    # Get Codes For Each Lesson
    codes = soup.find("div","single-content").find_all("script")
    
    # Check If Not Null
    # IF Lesson has code
    if(codes):
        title = "- [ ] {0}- {1}\n".format(num,title)
        ccoo = []
        for i, code in enumerate(codes):
            lang = code['class'][0].split('-')[1]
            co = ""
            if(i != len(codes)-1):
                co = "```{0}{1}```".format(lang,code.text)
            else:
                co = "```{0}{1}```\n".format(lang,code.text)
            
            ccoo.append(co)
        # Append All Codes For Each Lesson
        myDict[title] = ccoo
    
    # Else Lesson hasn't code
    else:
        title = "- [ ] {0}- {1}\n".format(num,title)
        myDict[title] = ""
              
# Print Result For Obsidian Markdown highlights 
print("# <u>Lectures:</u>")
for title in myDict:
    print(title)
    
print("---\n")

for item in myDict:
    if(myDict[item]):
        print("###### {0}".format(item.replace("- [ ]","").strip()))
        for code in myDict[item]:
            print(code)
        
```
