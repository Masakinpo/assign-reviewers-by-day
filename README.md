# assign-reviewers-by-day
- This is the action which adds reviewers to pull requests for each of the week based on the configuration yml.
- The action does not run if pull request is draft or its title includes WIP/wip.

## Usage
Create a workflow (e.g. .github/workflows/action.yml) for running the action.
Need to define configuration file as well.

```yaml
name: 'assign reviewer' #change name whatever you like 

on:
  pull_request:
    types: [ready_for_review] #chage the trigger as you like

jobs:
  add-reviewer:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - uses: masakinpo/assign-reviewers-by-day@v1.0.1
        with:
          repo-token: "${{ secrets.GITHUB_TOKEN }}"
```

## Configuration example
Add your configuration on .github/assign-reviewers-by-day.yml
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
      - everyday
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
