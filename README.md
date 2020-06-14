# assign-reviewers-by-day
- This is the action which adds reviewers to pull requests for each of the week based on the configuration yml.
- The action does not run in the following the conditions 
    - pull request is draft
    - PR's title includes WIP/wip

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
  # group: any group name you like. Note you must specify numOfReviewers for all groups.
  # day: "mon", "tue", "wed", "thu", "fri", "weekday", "weekend", "everyday" (all lower cases)
  # day can be omitted. In that case, it will be treated in the same fashion with "everyday"   
reviewers:
  - name: okajima
    group: infield
    day:
      - mon
      - tue
      - wed
  - name: fujita
    group: infield
    day:
      - thu
      - fri
  - name: ginji
    group: infield
  - name: jones
    group: dh
    day:
      - weekend
  - name: mcgehee
    group: infield
    day:
      - weekday
  - name: nakashima
    group: outfield
    day:
      - weekday
# the maximum number of reviewers added to the pull request
numOfReviewers:
  - infield: 1
  - dh: 1
  - outfield: 1

```
