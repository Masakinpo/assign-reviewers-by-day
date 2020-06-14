# assign-reviewers-by-day

Add your configuration on .github/assign-reviewers-by-day.yml
name must be

```yaml
# list of reviewer candidates
  # name: GitHub user name
  # kind: "must" or none
  # day: "mon", "tue", "wed", "thu", "fri", "weekday", "weekend", "everyday" (all lower cases)
reviewers:
  - name: okajima
    kind: must
    day:
      - mon
      - tue
      - wed
  - name: fujita
    kind: must
    day:
      - thu
      - fri
  - name: ginji
    day:
      - any
  - name: jones
    day:
      - weekend
  - name: mcgehee
    day:
      - weekday
# the maximum number of reviewers added to the pull request
numOfReviewers:
  - must: 1
  - other: 1

```

### Note 
- Assume no reviewers are assigned to PR before the action

