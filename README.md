# Conveyor
Объект, обрабатывающий данные с заданными промежутками времени

### Зависимости
Зависимостей нет. Может использоваться как на клиентской, так и на серверной стороне (разработка велась на io.js).

### Методы
<ul>
  <li><b>new Conveyor</b> - конструктор. Принимает следующие параметры:
    <ul>
      <li><b>processor(dataElement, cb)</b> - функция, обрабатывающая элемент данных dataElement. При установленном флаге useQueues после обработки данных должна вызывать cb() без параметров.</li>
      <li><b>params</b> - объект, содержащий параметры. Могут быть переданы следующие параметры:
        <ul>
          <li><i>period</i> - период (в мс), с которым запускается обработка данных. По умолчанию 1000.</li>
          <li><i>useQueue</i> - флаг, определяющий, нужно ли дожидаться окончания обработки одного элемента, чтобы приступать к обработке следующего. По умолчанию false.</li>
          <li><i>expectedElementsCounter</i> - число раз, сколько будет вызвана функция <b>add()</b> прежде, чем обработчик вызовет функцию <i>afterStopFunction()</i>. По умолчанию 0 (функция будет вызвана после окончания обработки всех заданных элементов)</li>
        </ul>
      </li>
      <li><i>afterStopFunction</i> - функция, которая будет вызвана после обработки всех данных. По умолчанию undefined (может быть задана в <b>whenStop(afterStopFunction)</b></li>
    </ul>
  <br>
  <li><b>Add(dataElement)</b> - функция, добавляющая элемент или массив элементов данных, которые нужно обработать. Обрабатываться элементы начинают сразу после добавления</li>
  <br>
  <li><b>whenStop(afterStopFunction)</b> - устанавливает функцию, которая будет вызвана после обработки всех имеющихся элементов данных. Если обработка данных к моменту вызова <b>whenStop()</b> не производится, то <i>afterStopFunction</i> будет вызвана немедленно.</li>
  <br>
  <li><b>forceStop()</b> - остановка обработки данных и вызов afterStopFunction, независимо от наличия необработанных элементов и от счётчика ожидаемых элементов данных (<i>expectedElementsCounter</i>)</li>
  <br>
  <li><b>wait(count)</b> - увеличить счётчик ожидаемых элементов данных (<i>expectedElementsCounter</i>) на count. По умолчанию count == 1.</li>
  <br>
  <li><b>unwait(count)</b> - уменьшить счётчик ожидаемых элементов данных (<i>expectedElementsCounter</i>) на count. По умолчанию count == 1.</li>
</ul>
### NPM
В npm можно найти данный модуль под именем dataconveyor
