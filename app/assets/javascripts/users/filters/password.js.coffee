# angular.module("Shop").filter "pull", ->
#   (value, wordwise, max, tail) ->
#     return ""  unless value
#     max = parseInt(max, 10)
#     return value  unless max
#     return value  if value.length <= max
#     value = value.substr(0, max)
#     if wordwise
#       lastspace = value.lastIndexOf(" ")
#       value = value.substr(0, lastspace)  unless lastspace is -1
#     value + (tail)