# assign-reviewers-by-day

Add your configuration on .github/assign-reviewers-by-day.yml

```yaml
reviewers:
  - name: Okajima
    kind: must
    day:
      - mon
      - tue
      - wed
  - name: Fujita
    kind: must
    day:
      - thu
      - fri
  - name: Ginji
    day:
      - any
  - name: Jones
    day:
      - weekend
  - name: McGehee
    day:
      - weekday
numOfReviewers:
  - must: 1
  - other: 1

```

### Note 
- If no one is available, assign to those who are available on the next day
- If PR has some reviewer before this action, num of reviewers assigned by this action will be (numOfReviwers) - (num of exiting reviewers)   

