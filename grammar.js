module.exports = grammar({
  name: 'ftl',

  conflicts: $ => [
    [$.directive, $._definition]
  ],

  rules: {
    source_file: $ => repeat($._definition),

    _definition: $ => choice(
      $.html_tag,
      $.html_end_tag,
      $.content,
      $.directive,
      $.interpolation,
      $.comment,
      $.end_directive
    ),

    content: $ => /[^<$#]+/,

    block_content: $ => prec.right(repeat1(choice(
      $.content,
      $.interpolation,
      $.comment,
      $.directive
    ))),

    directive: $ => choice(
      $.import_directive,
      $.macro_directive,
      $.if_directive,
      $.list_directive,
      $.items_directive,
      $.assign_directive,
      $.end_directive,
      $.macro_call,
      $.end_macro_call
    ),

    import_directive: $ => prec(2, seq(
      '<#import',
      $.string,
      'as',
      $.identifier,
      $._tag_close
    )),

    macro_directive: $ => prec(2, seq(
      '<#macro',
      $.identifier,
      repeat($.parameter),
      $._tag_close
    )),

    macro_call: $ => prec(2, seq(
      '<@',
      $.qualified_identifier,
      repeat($.named_parameter),
      optional(seq(';', $.identifier)),
      $._tag_close
    )),

    end_macro_call: $ => prec(2, seq(
      '</@',
      $.qualified_identifier,
      $._tag_close
    )),

    if_directive: $ => prec(2, seq(
      '<#if',
      field('condition', $.expression),
      $._tag_close,
      optional($.block_content),
      repeat($.elseif_branch),
      optional($.else_branch),
      $.if_end_tag
    )),

    elseif_branch: $ => prec(2, seq(
      '<#elseif',
      field('condition', $.expression),
      $._tag_close,
      optional($.block_content)
    )),

    else_branch: $ => seq(
      '<#else>',
      optional($.block_content)
    ),

    list_directive: $ => prec(2, seq(
      '<#list',
      field('collection', $.expression),
      optional(seq('as', field('variable', $.identifier))),
      $._tag_close,
      optional($.block_content),
      $.list_end_tag
    )),

    items_directive: $ => prec(2, seq(
      '<#items',
      'as',
      field('variable', $.identifier),
      $._tag_close,
      optional($.block_content),
      $.items_end_tag
    )),

    assign_directive: $ => prec(2, seq(
      '<#assign',
      field('name', $.identifier),
      '=',
      field('value', $.expression),
      $._tag_close
    )),

    end_directive: $ => prec(2, seq(
      '</#',
      $.identifier,
      $._tag_close
    )),

    interpolation: $ => seq(
      '${',
      $.expression,
      '}'
    ),

    expression: $ => choice(
      $.string,
      $.number,
      $.boolean,
      $.qualified_identifier,
      $.function_call,
      $.binary_expression,
      $.unary_expression,
      $.built_in_op,
      seq('(', $.expression, ')')
    ),

    binary_expression: $ => prec.left(choice(
      seq($.expression, '==', $.expression),
      seq($.expression, '!=', $.expression),
      prec(-1, seq($.expression, '=', $.expression)),
      seq($.expression, '<', $.expression),
      seq($.expression, '>', $.expression),
      seq($.expression, '<=', $.expression),
      seq($.expression, '>=', $.expression),
      seq($.expression, '+', $.expression),
      seq($.expression, '-', $.expression),
      seq($.expression, '*', $.expression),
      seq($.expression, '/', $.expression),
      seq($.expression, '||', $.expression),
      seq($.expression, '&&', $.expression)
    )),

    unary_expression: $ => prec.right(choice(
      seq('!', $.expression),
      seq('-', $.expression)
    )),

    function_call: $ => seq(
      $.qualified_identifier,
      '(',
      optional(sep($.expression, ",")),
      ')'
    ),

    built_in_op: $ => prec.left(seq(
      $.expression,
      choice(
        '?has_content',
        '?keep_before',
        '?no_esc',
        '?upper_case',
        '?lower_case',
        '?cap_first',
        '?trim',
        '?length',
        seq('?', $.identifier)
      ),
      optional(seq('(', $.expression, ')'))
    )),

    parameter: $ => $.identifier,

    named_parameter: $ => prec(1, seq(
      $.identifier,
      '=',
      $.expression
    )),

    qualified_identifier: $ => prec.right(seq(
      $.identifier,
      repeat(seq('.', $.identifier))
    )),

    _tag_close: $ => prec(1, alias('>', $.tag_delimiter)),

    string: $ => choice(
      seq('"', repeat(/[^"\\]|\\.?/), '"'),
      seq("'", repeat(/[^'\\]|\\.?/), "'")
    ),

    number: $ => /\d+(\.\d+)?/,
    boolean: $ => choice('true', 'false'),
    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,

    comment: $ => choice(
      seq('<#--', /[^-]*(-[^-])*(-(-[^>])?)*-->/),
      seq('//', /.*/)
    ),

    tag_name: $ => $.identifier,
    attribute_name: $ => $.identifier,
    attribute_value: $ => $.string,

    attribute: $ => seq(
      $.attribute_name,
      '=',
      $.attribute_value
    ),

    html_tag: $ => seq(
      '<',
      $.tag_name,
      repeat($.attribute),
      '>'
    ),

    html_end_tag: $ => seq(
      '</',
      $.tag_name,
      '>'
    ),

    if_end_tag: $ => '</#if>',
    list_end_tag: $ => '</#list>',
    items_end_tag: $ => '</#items>'
  },

  extras: $ => [
    /\s/
  ]
});

function sep(rule, separator) {
  return optional(seq(rule, repeat(seq(separator, rule))));
}
