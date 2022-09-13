# Task Summary

Implement a script that updates package.json in BitBucket repo and opens a pull request.

# What is working

* cloning given repo
* updating its package.json
* committing
* pull requesting

# Notes

* For some reason it only works with github, as bitbucket wont allow me to even clone the repository (not even log in for git) with popup...
And i cannot make it work at all, wanting something working that can be further updated i used (last hour) githup repo i own.
* Similar issue with using any form of login (when tried to use hardcoded username&password - i was informed it's no longer supported)

# What is left to do

* tests for each file (only one done)
* some code rearrangement for tests (move to exported function so we can test it)
* better branch naming (now its a bit random), but it should be configurable to some degree
* more configuration option (base branch - now its main)
* some cleaning before starting the up (old directory removal)
* better error handling, its prepared but more error, more granularity to know where they originates
