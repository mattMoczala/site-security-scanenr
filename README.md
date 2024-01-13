# Skaner podatności

## Wstęp

Aplikacja wyszukuje znane podatności strony popularnych bibliotek frontendowych takich jak:

- React
- Angular
- Ember.js
- jQuery
- jQuery-confirm

Aplikacja została rozbudowana o crawler, który zbiera przekierowania na podanej stronie, a następnie rekurencyjnie sprawdza przekierowania na wcześniej znalezionych stronach, aż do osiągniecią limitu głębokości (powrórzeń rekursji) podanego w trakcie wywołania skryptu.

## Uruchomienie aplikacji

Aplikacja wymaga środowiska Node.js w wersji 21.5.0

Aby wywołać aplikację należy pobrać zależne moduły poleceniem:
```
npm install
```
Następnie zbudować oraz uruchomić aplikację poleceniem:
```
npm run start
```

Następnie skrypt poprosi o wprowadzenie kolejno:

- adresu URL atakowanej strony
- informacji czy użyć crawlera
- (opcjonalnie) głębokości rekursji crawlera

## Wyszukiwane podatności:

Skaner można w prosty sposób rozbudować o kolejen podatności poprzez wprowadzenie dodadkowych warunków w pliku ./src/checkForVulnerabilities.ts

- https://react.dev/reference/react-dom/components/common#dangerously-setting-the-inner-html
- https://security.snyk.io/vuln/SNYK-JS-JQUERY-569619
- https://security.snyk.io/vuln/SNYK-JS-JQUERYCONFIRM-548943
- https://security.snyk.io/vuln/SNYK-JS-ANGULAR-3373044
- https://security.snyk.io/vuln/SNYK-JS-EMBERSOURCE-3105813

## Przykładowe podatne strony

Ember setProperty vulnerability
- https://ember-learn-super-rentals.herokuapp.com/

React dangerouslySetInnerHTML
- https://localhost:7070

jQuery load
- https://moczala.pl/
- https://strefa-prania.pl
