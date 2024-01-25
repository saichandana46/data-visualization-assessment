### Data Visualization Coding Assessment

### Question:
    The colleges.tsv dataset is a simplified version of the College Scorecard data and contains information about the school’s location, cost, and degree offerings. It also includes details about the student body in terms of demographic composition, areas of study, and labor market outcomes 10 years after enrollment. There’s also a feature called ‘top_50’ that denotes whether the school is in the US News and World Reports top rated schools. If any of the terms are unclear, please consult the data_dictionary.tsv.

    Prompt

    For this exercise you will be providing guidance to a hypothetical high schooler with limited savings for college. He hasn’t committed to a major or type of school but wants to keep debt to a minimum, hoping to pay off his student loans within 10 years of graduating. His questions include:

    What should I major in to make the most money after graduation?
    Will high SAT score improve my employment outcomes?
    Are there more affordable alternatives to the US News Top 50 that would get me comparable outcomes?

### Solutions

#### Deliverables:
- Programmed using D3.js library
- Zipped folder consisting of README, index.html and App.js files
- Run the index.html file in the browser. IF the browser blocks JS with a CORS exception, please use an extension or run a local server 

#### Explanation
#### 1. What should I major in to make the most money after graduation?
- As the student is not sure of major/school, We can draw multiple assumptions for this, getting the top major percentiles for each institution and assuming the earnings for each major provided the median earnings.
- As there is no direct relationship between majors and their earnings. I assumed it to compare median earnings for each institution to keep it simple.
- Created a bar chart with Institutions and Their Median Earnings.

#### 2. Will high Score improve my employment outcomes?
- This is kind of a straight forward question, for which I assumed the aggregation of SAT percentiles and compared it against the median earnings.
- Created a scatter plot to visualize median earnings based upon SAT scores

#### 3. Are there more affordable alternatives to the US News Top 50 that would get me comparable outcomes?
- Using the field Top50 to filter the institutions
- Compared Cost and Median Earnings for Top 50 and Non top 50 institutions
- Also, Compared the difference of median earnings when graduated from an institution and the cost of pursuing in that institution for Top 50 and Non Top 50 list
- Created Bar charts


        