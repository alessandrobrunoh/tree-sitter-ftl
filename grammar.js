module.exports = grammar({
  name: 'ftl',

  extras: $ => [
    $.line_comment,
    $.block_comment,
    /\s/
  ],


  rules: {
    source_file: $ => repeat($._definition),

    line_comment: $ => token(seq('<#--', /.*/, '-->')),
    block_comment: $ => token(seq(
      '/*',
      /[^*]*\*+([^/*][^*]*\*+)*/,
      '/'
    )),

    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,
    boolean: $ => choice('true', 'false'),
    number: $ => /[0-9]+(\.[0-9]+)?/,
    string: $ => /[^']*/,
    string_literal: $ => choice(
      seq('"', /[^"]*/, '"'),
      seq("'", /[^']*/, "'")
    ),
    variable: $ => seq(
      '${', $.identifier, '}'
    ),

    tag: $ => seq(
      choice(
        '</',
        '<'
      ),
      optional($.tag_type),
      $.tag_name,
      optional($.tag_content),
      '>'
    ),

    tag_type: $ => choice(
      "@",
      "#"
    ),
    tag_name: $ => prec.left(repeat1($.identifier)),
    tag_content: $ => choice(
      $.tag_import_as,
      $.tag_attributes
    ),
    tag_import_as: $ => seq(
      ' as ',
      $.string
    ),
    tag_attributes: $ => seq(
      ' ',
      $.identifier,
      '=',
      $.string_literal
    ),

    _definition: $ => choice(
      $.tag,
      $.tag_name,
      $.tag_attributes,
      $.boolean,
      $.number
    ),
  }
});
